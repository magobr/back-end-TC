// "use strict";

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
  Maze.kingX = Maze.start_.x;
  Maze.kingY = Maze.start_.y;

  if (first) {
    Maze.kingD = Maze.startDirection + 1;
    Maze.scheduleFinish(false);
    Maze.pidList.push(
      setTimeout(function() {
        Maze.stepSpeed = 100;
        Maze.schedule(
          [Maze.kingX, Maze.kingY, Maze.kingD * 4],
          [Maze.kingX, Maze.kingY, Maze.kingD * 4 - 4]
        );
        Maze.kingD++;
      }, Maze.stepSpeed * 5)
    );
  } else {
    Maze.kingD = Maze.startDirection;
    Maze.displayPegman(Maze.kingX, Maze.kingY, Maze.kingD * 4);
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

  numberOfSteps = 0;
  points = 0;
  document.getElementById("points").innerHTML = points;
  document.getElementById("lbl_numberOfTries").innerHTML = numberOfTries;
};

/**
 * Click the run button.  Start the program.
 * @param {!Event} e Mouse or touch event.
 */
Maze.execute = function() {
  if (!("Interpreter" in window)) {
    // Interpreter lazy loads and hasn't arrived yet.  Try again later.
    setTimeout(Maze.execute, 250);
    return;
  }

  Maze.log = [];
  Blockly.selected && Blockly.selected.unselect();
  var code = Blockly.JavaScript.workspaceToCode(Game.workspace);

  Maze.result = Maze.ResultType.UNSET;
  var interpreter = new Interpreter(code, Maze.initInterpreter);

  // Try running the user's code.  There are four possible outcomes:
  // 1. If king reaches the finish [SUCCESS], true is thrown.
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
  GameDialogs.hideDialog(false);
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

  if (
    Game.LEVEL == 1 &&
    Game.workspace.getTopBlocks(false).length > 1 &&
    Maze.result != Maze.ResultType.SUCCESS
  ) {
    Maze.levelHelp();
    return;
  }

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
  numberOfBlocks = Game.workspace.getAllBlocks().length;
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
  numberOfTries++;
  Maze.reset(false);
  Maze.levelHelp();
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
    return Maze.collect(3, id);
  };
  interpreter.setProperty(
    scope,
    "collect",
    interpreter.createNativeFunction(wrapper)
  );
};

Maze.levelHelp = function(opt_event) {
  if (opt_event && opt_event.type == Blockly.Events.UI) {
    // Just a change to highlighting or somesuch.
    return;
  } else if (Game.workspace.isDragging()) {
    // Don't change helps during drags.
    return;
  }
  //else if (Maze.result == Maze.ResultType.SUCCESS ||
  //            Game.loadFromLocalStorage(Game.NAME,
  //                                              Game.LEVEL)) {
  //   // The user has already won.  They are just playing around.
  //   return;
  // }
  var rtl = true;
  var userBlocks = Blockly.Xml.domToText(
    Blockly.Xml.workspaceToDom(Game.workspace)
  );
  var toolbar = Game.workspace.flyout_.workspace_.getTopBlocks(true);
  var content = document.getElementById("tipsPopup");
  var origin = null;
  var style = { width: "370px", left: "70%", top: "3em" };

  if (Game.LEVEL == 1) {
    var topBlocks = Game.workspace.getTopBlocks(true);

    if (topBlocks.length > 1) {
      var xml = [
        "<xml>",
        '<block type="maze_moveForward" x="10" y="10">',
        "<next>",
        '<block type="maze_moveForward"></block>',
        "</next>",
        "</block>",
        "</xml>"
      ];
      Game.injectReadonly("sampleOneTopBlock", xml);
      content = document.getElementById("dialogHelpOneTopBlock");

      origin = topBlocks[0].getSvgRoot();
    } else if (
      Game.workspace.getAllBlocks().length >= 2 &&
      Maze.result == Maze.ResultType.UNSET
    ) {
      content = document.getElementById("runPopup");
      style = { width: "360px", top: "410px", right: "400px" };
      var linesText = document.getElementById("runText");
      linesText.textContent = "Execute seu programa para ver o que acontece.";
      origin = document.getElementById("runButton");
    } else {
      content = null;
    }
  } else if (Game.LEVEL == 2) {
    if (
      userBlocks.indexOf("maze_turnRight") == -1 &&
      userBlocks.indexOf("maze_turnLeft") == -1
    ) {
      var linesText = document.getElementById("tipsText");
      linesText.textContent =
        "Utilize os blocos 'direita' e 'esquerda' para direcionar o rei para a direção correta";
    } else if (userBlocks.indexOf("collect") == -1) {
      var linesText = document.getElementById("tipsText");
      linesText.textContent =
        "Utilize o bloco coletar para pegar a flor durante o caminho e ganhar pontos.";
    }
    if (
      Maze.result != Maze.ResultType.UNSET &&
      document.getElementById("runButton").style.display == "none"
    ) {
      var linesText = document.getElementById("tipsText");
      linesText.textContent =
        "Seu programa não resolveu o labirinto. Aperte 'Reiniciar' e tente novamente.";
      origin = document.getElementById("resetButton");
    }
  } else if (Game.LEVEL == 3) {
    if (
      userBlocks.indexOf("maze_forever") == -1 &&
      userBlocks.indexOf("controls_repeat") == -1
    ) {
      var linesText = document.getElementById("tipsText");
      linesText.textContent =
        "Utilize o bloco 'repetir até (quantidade desejada)' ou 'repetir até o objetivo' para executar o comando de um bloco mais de uma vez.";
    } else {
      content = null;
    }
  } else if (Game.LEVEL == 4) {
    content = null;
  } else if (Game.LEVEL == 5) {
    var linesText = document.getElementById("tipsText");
    linesText.textContent =
      "Um bloco 'se' fará alguma coisa apenas se a condição for verdadeira. Já um bloco se-senão fará uma coisa ou outra.";
  } else if (Game.LEVEL > 5) {
    content = null;
  }

  if (content) {
    if (content.parentNode != document.getElementById("dialog")) {
      GameDialogs.showDialog(content, origin, true, false, style, null);
    }
  } else {
    GameDialogs.hideDialog(false);
  }
};

Maze.closeDialogStartLevel = function() {
  GameDialogs.hideDialog;

  Game.workspace.addChangeListener(Maze.levelHelp);
  Maze.levelHelp();
};

Maze.initLevelDialog = function() {
  var toolbar = Game.workspace.flyout_.workspace_.getTopBlocks(true);
  var content = document.getElementById("dialogStartLevel");
  var style = { width: "370px", left: "30%", top: "3em" };
  var ok = document.getElementById("startLevelOk");
  ok.addEventListener("click", Maze.closeDialogStartLevel, true);
  ok.addEventListener("touchend", Maze.closeDialogStartLevel, true);

  if (Game.LEVEL == 1) {
    var linesText = document.getElementById("dialogStartLevelText");
    linesText.textContent =
      "Arraste alguns blocos 'avançar' para me ajudar a alcançar o objetivo.";
    origin = toolbar[0].getSvgRoot();
  } else if (Game.LEVEL == 2) {
    var linesText = document.getElementById("dialogStartLevelText");
    linesText.textContent =
      "Utilize os blocos 'direita' e 'esquerda' para direcionar o rei para a direção correta";
  } else if (Game.LEVEL == 3) {
    var linesText = document.getElementById("dialogStartLevelText");
    linesText.textContent =
      "Utilize o bloco 'repetir até (quantidade desejada)' ou 'repetir até o objetivo' para executar o comando de um bloco mais de uma vez.";
  } else if (Game.LEVEL == 4) {
    content = null;
  } else if (Game.LEVEL == 5) {
    var linesText = document.getElementById("dialogStartLevelText");
    linesText.textContent =
      "Agora é com você! Tente utilizar a menor quantidade de blocos para guiar o rei até a sua coroa e no caminho tente coletar a maior quantidade de flores que você conseguir ";
  } else if (Game.LEVEL > 5) {
    content = null;
  }

  if (content) {
    if (content.parentNode != document.getElementById("dialog")) {
      GameDialogs.showDialog(content, null, false, true, style, null);
    }
  } else {
    GameDialogs.hideDialog(false);
  }
};

Game.displayLevelLink = function() {
  var levelLink = document.getElementById("levelLink");

  for (var i = 1; i <= Game.MAX_LEVEL; ++i) {
    if (i == Game.LEVEL) {
      var levelDone = document.createElement("SPAN");
      levelDone.setAttribute("id", "level" + i);
      levelDone.className = "level_number level_done";
      levelDone.innerHTML = i;
      levelLink.appendChild(levelDone);
    } else if (i == Game.MAX_LEVEL) {
      var level = document.createElement("a");
      level.setAttribute("id", "level" + i);
      level.className = "level_number";
      level.href = "?level=" + i;
      level.innerHTML = i;
      levelLink.appendChild(level);
    } else {
      var levelDot = document.createElement("a");
      levelDot.setAttribute("id", "level" + i);
      levelDot.className = "level_dot";
      levelDot.href = "?level=" + i;
      levelLink.appendChild(levelDot);
    }
  }
};

Maze.init = function() {
  // BlocklyInterface.init();

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

  Game.initToolbox(Maze);
  Game.initWorkspace();

  //Game.workspace.getAudioManager().load(Maze.SKIN.winSound, 'win');
  //Game.workspace.getAudioManager().load(Maze.SKIN.crashSound, 'fail');
  // Not really needed, there are no user-defined functions or variables.
  Blockly.JavaScript.addReservedWords(
    "moveForward,moveBackward," +
      "turnRight,turnLeft,isPathForward,isPathRight,isPathBackward,isPathLeft"
  );

  Maze.drawMap();

  var defaultXml =
    "<xml>" +
    '  <block movable="' +
    (Game.LEVEL != 1) +
    '" ' +
    'type="maze_moveForward" x="70" y="70"></block>' +
    "</xml>";
  Game.loadBlocks(defaultXml, false);

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

        flowerId++;
      }
    }
  }

  Game.displayLevelLink();
  Maze.reset(true);

  // document.body.addEventListener("mousemove", Maze.updatePegSpin_, true);

  Game.bindClick(document.getElementById("runButton"), Maze.runButtonClick);
  Game.bindClick(document.getElementById("resetButton"), Maze.resetButtonClick);

  Maze.initLevelDialog();

  if (Game.LEVEL == 1) {
    // Make connecting blocks easier for beginners.
    Blockly.SNAP_RADIUS *= 2;
    Blockly.CONNECTING_SNAP_RADIUS = Blockly.SNAP_RADIUS;
  }

  // else {
  //   // All other levels get interactive help.  But wait 5 seconds for the
  //   // user to think a bit before they are told what to do.
  //   setTimeout(function() {
  //     Game.workspace.addChangeListener(Maze.levelHelp);
  //     Maze.levelHelp();
  //   }, 5000);
  // }

  // Add the spinning Pegman icon to the done dialog.
  // <img id="pegSpin" src="common/1x1.gif">
  var buttonDiv = document.getElementById("dialogDoneButtons");
  var pegSpin = document.createElement("img");
  pegSpin.id = "pegSpin";
  pegSpin.src = "../../../static/img/1x1.gif";
  pegSpin.style.backgroundImage = "url(" + Maze.SKIN.sprite + ")";
  buttonDiv.parentNode.insertBefore(pegSpin, buttonDiv);

  // Lazy-load the JavaScript interpreter.
  setTimeout(Game.importInterpreter, 1);
  // Lazy-load the syntax-highlighting.
  setTimeout(Game.importPrettify, 1);
};

window.addEventListener("load", Maze.init);
