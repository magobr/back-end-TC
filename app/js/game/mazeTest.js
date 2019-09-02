"use strict";

goog.provide("Maze");

goog.require("Blockly.FieldDropdown");
goog.require("BlocklyInterface");
goog.require("Maze.Blocks");

Maze.ResultType = {
  UNSET: 0,
  SUCCESS: 1,
  FAILURE: -1,
  TIMEOUT: 2,
  ERROR: -2
};

Maze.flowers = [];

/**
 * Result of last execution.
 */
Maze.result = Maze.ResultType.UNSET;

Maze.DirectionType = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
};

Maze.startDirection = Maze.DirectionType.EAST;
Maze.reset = function(first) {
  // Kill all tasks.
  for (var i = 0; i < Maze.pidList.length; i++) {
    window.clearTimeout(Maze.pidList[i]);
  }
  Maze.pidList = [];

  // Move Pegman into position.
  Maze.pegmanX = Maze.start_.x;
  Maze.pegmanY = Maze.start_.y;

  if (first) {
    Maze.pegmanD = Maze.startDirection + 1;
    Maze.scheduleFinish(false);
    Maze.pidList.push(
      setTimeout(function() {
        Maze.stepSpeed = 100;
        Maze.schedule(
          [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
          [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4 - 4]
        );
        Maze.pegmanD++;
      }, Maze.stepSpeed * 5)
    );
  } else {
    Maze.pegmanD = Maze.startDirection;
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4);
  }

  // Move the finish icon into position.
  var finishIcon = document.getElementById("finish");
  finishIcon.setAttribute(
    "x",
    Maze.SQUARE_SIZE * (Maze.finish_.x + 0.5) -
      finishIcon.getAttribute("width") / 2
  );
  finishIcon.setAttribute(
    "y",
    Maze.SQUARE_SIZE * (Maze.finish_.y + 0.6) -
      finishIcon.getAttribute("height")
  );

  // Make 'look' icon invisible and promote to top.
  var lookIcon = document.getElementById("look");
  lookIcon.style.display = "none";
  lookIcon.parentNode.appendChild(lookIcon);
  var paths = lookIcon.getElementsByTagName("path");
  for (var i = 0, path; (path = paths[i]); i++) {
    path.setAttribute("stroke", Maze.SKIN.look);
  }
  // Move the collect icon into position.
  Maze.flowers.map(flower => {
    var flowerIcon = document.getElementById("flower" + flower.id);
    console.log("flowerIcon", flowerIcon);
    flowerIcon.setAttribute(
      "x",
      Maze.SQUARE_SIZE * (flower.x + 0.5) - flowerIcon.getAttribute("width") / 2
    );
    flowerIcon.setAttribute(
      "y",
      Maze.SQUARE_SIZE * (flower.y + 0.6) - flowerIcon.getAttribute("height")
    );
    flowerIcon.style.opacity = "1";
  });
};

/**
 * Click the run button.  Start the program.
 * @param {!Event} e Mouse or touch event.
 */
Maze.execute = function() {
  if (!("Interpreter" in window)) {
    console.log("teste");
    // Interpreter lazy loads and hasn't arrived yet.  Try again later.
    setTimeout(Maze.execute, 250);
    return;
  }

  Maze.log = [];
  Blockly.selected && Blockly.selected.unselect();
  var code = Blockly.JavaScript.workspaceToCode(Game.workspace);
  console.log("code", code);
  Maze.result = Maze.ResultType.UNSET;
  var interpreter = new Interpreter(code, Maze.initInterpreter);

  // Try running the user's code.  There are four possible outcomes:
  // 1. If pegman reaches the finish [SUCCESS], true is thrown.
  // 2. If the program is terminated due to running too long [TIMEOUT],
  //    false is thrown.
  // 3. If another error occurs [ERROR], that error is thrown.
  // 4. If the program ended normally but without solving the maze [FAILURE],
  //    no error or exception is thrown.
  try {
    var ticks = 10000; // 10k ticks runs Pegman for about 8 minutes.
    while (interpreter.step()) {
      if (ticks-- == 0) {
        throw Infinity;
      }
    }
    Maze.result = Maze.notDone()
      ? Maze.ResultType.FAILURE
      : Maze.ResultType.SUCCESS;
  } catch (e) {
    // A boolean is thrown for normal termination.
    // Abnormal termination is a user error.
    if (e === Infinity) {
      Maze.result = Maze.ResultType.TIMEOUT;
    } else if (e === false) {
      Maze.result = Maze.ResultType.ERROR;
    } else {
      // Syntax error, can't happen.
      Maze.result = Maze.ResultType.ERROR;
      alert(e);
    }
  }

  // Fast animation if execution is successful.  Slow otherwise.
  if (Maze.result == Maze.ResultType.SUCCESS) {
    Maze.stepSpeed = 100;
    Maze.log.push(["finish", null]);
  } else {
    Maze.stepSpeed = 150;
  }

  // Maze.log now contains a transcript of all the user's actions.
  // Reset the maze and animate the transcript.
  Maze.reset(false);
  Maze.pidList.push(setTimeout(Maze.animate, 100));
};

Maze.runButtonClick = function(e) {
  // Prevent double-clicks or double-taps.
  // if (BlocklyInterface.eventSpam(e)) {
  //   return;
  // }
  // //BlocklyDialogs.hideDialog(false);
  // // Only allow a single top block on level 1.
  // if (
  //   BlocklyGames.LEVEL == 1 &&
  //   BlocklyGames.workspace.getTopBlocks(false).length > 1 &&
  //   Maze.result != Maze.ResultType.SUCCESS &&
  //   !BlocklyGames.loadFromLocalStorage(BlocklyGames.NAME, BlocklyGames.LEVEL)
  // ) {
  //   Maze.levelHelp();
  //   return;
  // }
  var runButton = document.getElementById("runButton");
  var resetButton = document.getElementById("resetButton");
  // Ensure that Reset button is at least as wide as Run button.
  if (!resetButton.style.minWidth) {
    resetButton.style.minWidth = runButton.offsetWidth + "px";
  }
  runButton.style.display = "none";
  resetButton.style.display = "inline";
  Maze.reset(false);
  Maze.execute();
};

Maze.resetButtonClick = function(e) {
  // Prevent double-clicks or double-taps.
  // if (BlocklyInterface.eventSpam(e)) {
  //   return;
  // }
  var runButton = document.getElementById("runButton");
  runButton.style.display = "inline";
  document.getElementById("resetButton").style.display = "none";
  Game.workspace.highlightBlock(null);
  Maze.reset(false);
  Maze.levelHelp();
};

/**
 * Is the player at the finish marker?
 * @return {boolean} True if not done, false if done.
 */
Maze.notDone = function() {
  return Maze.pegmanX != Maze.finish_.x || Maze.pegmanY != Maze.finish_.y;
};

Maze.initInterpreter = function(interpreter, scope) {
  // API
  var wrapper;
  wrapper = function(id) {
    Maze.move(0, id);
  };
  interpreter.setProperty(
    scope,
    "moveForward",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function(id) {
    Maze.move(2, id);
  };
  interpreter.setProperty(
    scope,
    "moveBackward",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function(id) {
    Maze.turn(0, id);
  };
  interpreter.setProperty(
    scope,
    "turnLeft",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function(id) {
    Maze.turn(1, id);
  };
  interpreter.setProperty(
    scope,
    "turnRight",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function(id) {
    return Maze.isPath(0, id);
  };
  interpreter.setProperty(
    scope,
    "isPathForward",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function(id) {
    return Maze.isPath(1, id);
  };
  interpreter.setProperty(
    scope,
    "isPathRight",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function(id) {
    return Maze.isPath(2, id);
  };
  interpreter.setProperty(
    scope,
    "isPathBackward",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function(id) {
    return Maze.isPath(3, id);
  };
  interpreter.setProperty(
    scope,
    "isPathLeft",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function() {
    return Maze.notDone();
  };
  interpreter.setProperty(
    scope,
    "notDone",
    interpreter.createNativeFunction(wrapper)
  );
  wrapper = function(id) {
    console.log("id", id);
    return Maze.collect(3, id);
  };
  interpreter.setProperty(
    scope,
    "collect",
    interpreter.createNativeFunction(wrapper)
  );
};

Maze.init = function() {
  // BlocklyInterface.init();

  // Setup the Pegman menu.
  //   var pegmanImg = document.querySelector("#pegmanButton>img");
  //   pegmanImg.style.backgroundImage = "url(" + Maze.SKIN.sprite + ")";
  //   var pegmanMenu = document.getElementById("pegmanMenu");
  //   var handlerFactory = function(n) {
  //     return function() {
  //       Maze.changePegman(n);
  //     };
  //   };
  //   for (var i = 0; i < Maze.SKINS.length; i++) {
  //     if (i == Maze.SKIN_ID) {
  //       continue;
  //     }
  //     var div = document.createElement("div");
  //     var img = document.createElement("img");
  //     img.src = "common/1x1.gif";
  //     img.style.backgroundImage = "url(" + Maze.SKINS[i].sprite + ")";
  //     div.appendChild(img);
  //     pegmanMenu.appendChild(div);
  //     Blockly.bindEvent_(div, "mousedown", null, handlerFactory(i));
  //   }
  //   Blockly.bindEvent_(window, "resize", null, Maze.hidePegmanMenu);
  //   var pegmanButton = document.getElementById("pegmanButton");
  //   Blockly.bindEvent_(pegmanButton, "mousedown", null, Maze.showPegmanMenu);
  //   var pegmanButtonArrow = document.getElementById("pegmanButtonArrow");
  //   var arrow = document.createTextNode(Blockly.FieldDropdown.ARROW_CHAR);
  //   pegmanButtonArrow.appendChild(arrow);

  //var rtl = BlocklyGames.isRtl();
  var blocklyDiv = document.getElementById("blockly");
  var visualization = document.getElementById("visualization");
  var onresize = function(e) {
    var top = visualization.offsetTop;
    blocklyDiv.style.top = Math.max(10, top - window.pageYOffset) + "px";
    blocklyDiv.style.left = "420px";
    blocklyDiv.style.width = window.innerWidth - 440 + "px";
  };
  window.addEventListener("scroll", function() {
    onresize(null);
    Blockly.svgResize(Game.workspace);
  });
  window.addEventListener("resize", onresize);
  onresize(null);

  // var toolbox = document.getElementById("toolbox");
  // // Scale the workspace so level 1 = 1.3, and level 10 = 1.0.
  // var scale = 1 + (1 - Game.LEVEL / Game.MAX_LEVEL) / 3;
  // Game.workspace = Blockly.inject("blockly", {
  //   media: "blockly/media/",
  //   maxBlocks: Maze.MAX_BLOCKS,
  //   toolbox: toolbox,
  //   trashcan: true,
  //   zoom: { startScale: scale }
  // });

  Game.initToolbox(Maze);
  Game.initWorkspace(Maze.MAX_BLOCKS);

  //Game.workspace.getAudioManager().load(Maze.SKIN.winSound, 'win');
  //Game.workspace.getAudioManager().load(Maze.SKIN.crashSound, 'fail');
  // Not really needed, there are no user-defined functions or variables.
  Blockly.JavaScript.addReservedWords(
    "moveForward,moveBackward," +
      "turnRight,turnLeft,isPathForward,isPathRight,isPathBackward,isPathLeft"
  );

  Maze.drawMap();

  //   var defaultXml =
  //     "<xml>" +
  //     '  <block movable="' +
  //     (Game.LEVEL != 1) +
  //     '" ' +
  //     'type="maze_moveForward" x="70" y="70"></block>' +
  //     "</xml>";
  //   Game.loadBlocks(defaultXml, false);

  // Locate the start and finish squares.

  var flowerId = 0;
  for (var y = 0; y < Maze.ROWS; y++) {
    for (var x = 0; x < Maze.COLS; x++) {
      if (Maze.map[y][x] == Maze.SquareType.START) {
        Maze.start_ = { x: x, y: y };
      } else if (Maze.map[y][x] == Maze.SquareType.FINISH) {
        Maze.finish_ = { x: x, y: y };
      } else if (Maze.map[y][x] == Maze.SquareType.COLLECT) {
        Maze.flowers.push({ id: flowerId, x: x, y: y });
        console.log("maze.collect.id", Maze.flowers);

        flowerId++;
      }
    }
  }

  Maze.reset(true);
  //Game.workspace.addChangeListener(function() {Maze.updateCapacity();});

  // document.body.addEventListener("mousemove", Maze.updatePegSpin_, true);

  Game.bindClick(document.getElementById("runButton"), Maze.runButtonClick);
  Game.bindClick(document.getElementById("resetButton"), Maze.resetButtonClick);

  if (Game.LEVEL == 1) {
    // Make connecting blocks easier for beginners.
    Blockly.SNAP_RADIUS *= 2;
    Blockly.CONNECTING_SNAP_RADIUS = Blockly.SNAP_RADIUS;
  }
  // if (Game.LEVEL == 10) {
  //   if (!Game.loadFromLocalStorage(Game.NAME, Game.LEVEL)) {
  //     // Level 10 gets an introductory modal dialog.
  //     // Skip the dialog if the user has already won.
  //     var content = document.getElementById("dialogHelpWallFollow");
  //     var style = {
  //       width: "30%",
  //       left: "35%",
  //       top: "12em"
  //     };
  //     BlocklyDialogs.showDialog(
  //       content,
  //       null,
  //       false,
  //       true,
  //       style,
  //       BlocklyDialogs.stopDialogKeyDown
  //     );
  //     BlocklyDialogs.startDialogKeyDown();
  //     setTimeout(BlocklyDialogs.abortOffer, 5 * 60 * 1000);
  //   }
  // } else {
  //   // All other levels get interactive help.  But wait 5 seconds for the
  //   // user to think a bit before they are told what to do.
  //   setTimeout(function() {
  //     Game.workspace.addChangeListener(Maze.levelHelp);
  //     Maze.levelHelp();
  //   }, 5000);
  // }

  // Add the spinning Pegman icon to the done dialog.
  // <img id="pegSpin" src="common/1x1.gif">
  // var buttonDiv = document.getElementById("dialogDoneButtons");
  // var pegSpin = document.createElement("img");
  // pegSpin.id = "pegSpin";
  // pegSpin.src = "common/1x1.gif";
  // pegSpin.style.backgroundImage = "url(" + Maze.SKIN.sprite + ")";
  // buttonDiv.parentNode.insertBefore(pegSpin, buttonDiv);

  // Lazy-load the JavaScript interpreter.
  setTimeout(Game.importInterpreter, 1);
  // Lazy-load the syntax-highlighting.
  setTimeout(Game.importPrettify, 1);
};

window.addEventListener("load", Maze.init);
