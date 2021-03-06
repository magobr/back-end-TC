"use strict";

goog.provide("GameDialogs");

goog.require("Blockly");
goog.require("goog.style");

GameDialogs.isDialogVisible_ = false;

/**
 * A closing dialog should animate towards this element.
 * @type Element
 * @private
 */
GameDialogs.dialogOrigin_ = null;

/**
 * A function to call when a dialog closes.
 * @type Function
 * @private
 */
GameDialogs.dialogDispose_ = null;

/**
 * Show the dialog pop-up.
 * @param {Element} content DOM element to display in the dialog.
 * @param {Element} origin Animate the dialog opening/closing from/to this
 *     DOM element.  If null, don't show any animations for opening or closing.
 * @param {boolean} animate Animate the dialog opening (if origin not null).
 * @param {boolean} modal If true, grey out background and prevent interaction.
 * @param {!Object} style A dictionary of style rules for the dialog.
 * @param {Function} disposeFunc An optional function to call when the dialog
 *     closes.  Normally used for unhooking events.
 */
GameDialogs.showDialog = function(
  content,
  origin,
  animate,
  modal,
  style,
  disposeFunc
) {
  if (!content) {
    throw TypeError("Content not found: " + content);
  }
  if (GameDialogs.isDialogVisible_) {
    GameDialogs.hideDialog(false);
  }
  if (Blockly.getMainWorkspace()) {
    // Some levels have an editor instead of Blockly.
    Blockly.hideChaff(true);
  }
  GameDialogs.isDialogVisible_ = true;
  GameDialogs.dialogOrigin_ = origin;
  GameDialogs.dialogDispose_ = disposeFunc;
  var dialog = document.getElementById("dialog");
  var shadow = document.getElementById("dialogShadow");
  var border = document.getElementById("dialogBorder");

  // Copy all the specified styles to the dialog.
  for (var name in style) {
    dialog.style[name] = style[name];
  }
  if (modal) {
    shadow.style.visibility = "visible";
    shadow.style.opacity = 0.3;
    shadow.style.zIndex = 9;
    var header = document.createElement("div");
    header.id = "dialogHeader";
    dialog.appendChild(header);
    GameDialogs.dialogMouseDownWrapper_ = Blockly.bindEvent_(
      header,
      "mousedown",
      null,
      GameDialogs.dialogMouseDown_
    );
  }
  dialog.appendChild(content);
  content.className = content.className.replace("dialogHiddenContent", "");

  function endResult() {
    // Check that the dialog wasn't closed during opening.
    if (GameDialogs.isDialogVisible_) {
      dialog.style.visibility = "visible";
      dialog.style.zIndex = 10;
      border.style.visibility = "hidden";
    }
  }
  if (animate && origin) {
    GameDialogs.matchBorder_(origin, false, 0.2);
    GameDialogs.matchBorder_(dialog, true, 0.8);
    // In 175ms show the dialog and hide the animated border.
    setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
};

/**
 * Horizontal start coordinate of dialog drag.
 */
GameDialogs.dialogStartX_ = 0;

/**
 * Vertical start coordinate of dialog drag.
 */
GameDialogs.dialogStartY_ = 0;

/**
 * Handle start of drag of dialog.
 * @param {!Event} e Mouse down event.
 * @private
 */
GameDialogs.dialogMouseDown_ = function(e) {
  GameDialogs.dialogUnbindDragEvents_();
  if (Blockly.utils.isRightButton(e)) {
    // Right-click.
    return;
  }
  // Left click (or middle click).
  // Record the starting offset between the current location and the mouse.
  var dialog = document.getElementById("dialog");
  GameDialogs.dialogStartX_ = dialog.offsetLeft - e.clientX;
  GameDialogs.dialogStartY_ = dialog.offsetTop - e.clientY;

  GameDialogs.dialogMouseUpWrapper_ = Blockly.bindEvent_(
    document,
    "mouseup",
    null,
    GameDialogs.dialogUnbindDragEvents_
  );
  GameDialogs.dialogMouseMoveWrapper_ = Blockly.bindEvent_(
    document,
    "mousemove",
    null,
    GameDialogs.dialogMouseMove_
  );
  // This event has been handled.  No need to bubble up to the document.
  e.stopPropagation();
};

/**
 * Drag the dialog to follow the mouse.
 * @param {!Event} e Mouse move event.
 * @private
 */
GameDialogs.dialogMouseMove_ = function(e) {
  var dialog = document.getElementById("dialog");
  var dialogLeft = GameDialogs.dialogStartX_ + e.clientX;
  var dialogTop = GameDialogs.dialogStartY_ + e.clientY;
  dialogTop = Math.max(dialogTop, 0);
  dialogTop = Math.min(dialogTop, window.innerHeight - dialog.offsetHeight);
  dialogLeft = Math.max(dialogLeft, 0);
  dialogLeft = Math.min(dialogLeft, window.innerWidth - dialog.offsetWidth);
  dialog.style.left = dialogLeft + "px";
  dialog.style.top = dialogTop + "px";
};

/**
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
GameDialogs.dialogUnbindDragEvents_ = function() {
  if (GameDialogs.dialogMouseUpWrapper_) {
    Blockly.unbindEvent_(GameDialogs.dialogMouseUpWrapper_);
    GameDialogs.dialogMouseUpWrapper_ = null;
  }
  if (GameDialogs.dialogMouseMoveWrapper_) {
    Blockly.unbindEvent_(GameDialogs.dialogMouseMoveWrapper_);
    GameDialogs.dialogMouseMoveWrapper_ = null;
  }
};

/**
 * Hide the dialog pop-up.
 * @param {boolean} opt_animate Animate the dialog closing.  Defaults to true.
 *     Requires that origin was not null when dialog was opened.
 */
GameDialogs.hideDialog = function(opt_animate) {
  if (!GameDialogs.isDialogVisible_) {
    return;
  }
  GameDialogs.dialogUnbindDragEvents_();
  if (GameDialogs.dialogMouseDownWrapper_) {
    Blockly.unbindEvent_(GameDialogs.dialogMouseDownWrapper_);
    GameDialogs.dialogMouseDownWrapper_ = null;
  }

  GameDialogs.isDialogVisible_ = false;
  GameDialogs.dialogDispose_ && GameDialogs.dialogDispose_();
  GameDialogs.dialogDispose_ = null;
  var origin = opt_animate === false ? null : GameDialogs.dialogOrigin_;
  var dialog = document.getElementById("dialog");
  var shadow = document.getElementById("dialogShadow");

  shadow.style.opacity = 0;

  function endResult() {
    shadow.style.zIndex = -1;
    shadow.style.visibility = "hidden";
    var border = document.getElementById("dialogBorder");
    border.style.visibility = "hidden";
  }
  if (origin && dialog) {
    GameDialogs.matchBorder_(dialog, false, 0.8);
    GameDialogs.matchBorder_(origin, true, 0.2);
    // In 175ms hide both the shadow and the animated border.
    setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
  dialog.style.visibility = "hidden";
  dialog.style.zIndex = -1;
  var header = document.getElementById("dialogHeader");
  if (header) {
    header.parentNode.removeChild(header);
  }
  while (dialog.firstChild) {
    var content = dialog.firstChild;
    content.className += " dialogHiddenContent";
    document.body.appendChild(content);
  }
};

/**
 * Match the animated border to the a element's size and location.
 * @param {!Element} element Element to match.
 * @param {boolean} animate Animate to the new location.
 * @param {number} opacity Opacity of border.
 * @private
 */
GameDialogs.matchBorder_ = function(element, animate, opacity) {
  if (!element) {
    return;
  }
  var border = document.getElementById("dialogBorder");
  var bBox = GameDialogs.getBBox_(element);
  function change() {
    border.style.width = bBox.width + "px";
    border.style.height = bBox.height + "px";
    border.style.left = bBox.x + "px";
    border.style.top = bBox.y + "px";
    border.style.opacity = opacity;
  }
  if (animate) {
    border.className = "dialogAnimate";
    setTimeout(change, 1);
  } else {
    border.className = "";
    change();
  }
  border.style.visibility = "visible";
};

/**
 * Compute the absolute coordinates and dimensions of an HTML or SVG element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
GameDialogs.getBBox_ = function(element) {
  var xy = goog.style.getPageOffset(element);
  var box = {
    x: xy.x,
    y: xy.y
  };
  if (element.getBBox) {
    // SVG element.
    var bBox = element.getBBox();
    box.height = bBox.height;
    box.width = bBox.width;
  } else {
    // HTML element.
    box.height = element.offsetHeight;
    box.width = element.offsetWidth;
  }
  return box;
};

/**
 * Parabeniza o usuário por completar o nível e oferece direcioná-lo para o próximo nível, se este estiver disponível.
 */
GameDialogs.congratulations = function() {
  var content = document.getElementById("dialogDone");
  var style = {
    width: "40%",
    left: "30%",
    top: "3em"
  };

  // Adiciona o código do usuário.
  if (Game.workspace) {
    var linesText = document.getElementById("dialogLinesText");
    linesText.textContent = "";
    // Line produces warning when compiling Puzzle since there is no JavaScript
    // generator.  But this function is never called in Puzzle, so no matter.
    var code = Blockly.JavaScript.workspaceToCode(Game.workspace);
    code = Game.stripCode(code);
    var noComments = code.replace(/\/\/[^\n]*/g, ""); // Inline comments.
    noComments = noComments.replace(/\/\*.*\*\//g, ""); /* Block comments. */
    noComments = noComments.replace(/[ \t]+\n/g, "\n"); // Trailing spaces.
    noComments = noComments.replace(/\n+/g, "\n"); // Blank lines.
    noComments = noComments.trim();
    var lineCount = noComments.split("\n").length;
    var pre = document.getElementById("containerCode");
    pre.textContent = code;
    if (typeof prettyPrintOne == "function") {
      code = pre.innerHTML;
      code = prettyPrintOne(code, "js");
      pre.innerHTML = code;
    }
    if (lineCount == 1) {
      var text = Blockly.Msg.GAMES_LINES_OF_CODE_1;
    } else {
      var text = Blockly.Msg.GAMES_LINES_OF_CODE_2.replace(
        "%1",
        String(lineCount)
      );
    }
    linesText.appendChild(document.createTextNode(text));
  }

  if (Game.LEVEL < Game.MAX_LEVEL) {
    var text = Blockly.Msg.GAMES_NEXT_LEVEL.replace(
      "%1",
      String(Game.LEVEL + 1)
    );
  } else {
    var text = Blockly.Msg.GAMES_FINAL_LEVEL;
  }

  var cancel = document.getElementById("doneCancel");
  cancel.addEventListener("click", GameDialogs.hideDialog, true);
  cancel.addEventListener("touchend", GameDialogs.hideDialog, true);
  var ok = document.getElementById("doneOk");
  ok.addEventListener("click", Game.nextLevel, true);
  ok.addEventListener("touchend", Game.nextLevel, true);

  GameDialogs.showDialog(content, null, false, true, style, function() {
    document.body.removeEventListener(
      "keydown",
      GameDialogs.congratulationsKeyDown,
      true
    );
  });
  document.body.addEventListener(
    "keydown",
    GameDialogs.congratulationsKeyDown,
    true
  );

  document.getElementById("dialogDoneText").textContent = text;
};

/**
 * Se o usuário pressionar o enter, escape, ou espaço o dialog que aparece quando o usuário termina o nível será fechado.
 * Enter and space move to the next level, escape does not.
 * @param {!Event} e Evento do teclado.
 */
GameDialogs.congratulationsKeyDown = function(e) {
  if (e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 32) {
    GameDialogs.hideDialog(true);
    e.stopPropagation();
    e.preventDefault();
    if (e.keyCode != 27) {
      Game.nextLevel();
    }
  }
};
