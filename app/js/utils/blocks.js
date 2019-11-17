"use strict";

goog.provide("Maze.Blocks");

goog.require("Blockly");
goog.require("Blockly.JavaScript");
goog.require("BlocklyGames");

/**
 * Common HSV hue for all movement blocks.
 */
Maze.Blocks.MOVEMENT_HUE = 290;

/**
 * HSV hue for loop block.
 */
Maze.Blocks.LOOPS_HUE = 120;

/**
 * Common HSV hue for all logic blocks.
 */
Maze.Blocks.LOGIC_HUE = 210;
/**
 * Common HSV hue for all collect blocks.
 */
Maze.Blocks.COLLECT = 330;

/**
 * Left turn arrow to be appended to messages.
 */
Maze.Blocks.LEFT_TURN = " \u21BA";

/**
 * Left turn arrow to be appended to messages.
 */
Maze.Blocks.RIGHT_TURN = " \u21BB";

// Extensions to Blockly's existing blocks and JavaScript generator.

Blockly.Blocks["maze_moveForward"] = {
  /**
   * Block for moving forward.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      message0: Blockly.Msg.MAZE_MOVE_FOWARD,
      previousStatement: null,
      nextStatement: null,
      colour: Maze.Blocks.MOVEMENT_HUE,
      tooltip: Blockly.Msg.MAZE_MOVE_FORWARD_TOOLTIP
    });
  }
};

Blockly.JavaScript["maze_moveForward"] = function(block) {
  // Generate JavaScript for moving forward.
  return "moveForward('block_id_" + block.id + "');\n";
};

Blockly.Blocks["maze_turnRight"] = {
  /**
   * Block for moving forward.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      message0: Blockly.Msg.MAZE_TURN_RIGHT,
      previousStatement: null,
      nextStatement: null,
      colour: Maze.Blocks.MOVEMENT_HUE,
      tooltip: Blockly.Msg.MAZE_TURN_RIGHT_TOOLTIP
    });
  }
};

Blockly.JavaScript["maze_turnRight"] = function(block) {
  // Generate JavaScript for turning left or right.

  return "turnRight('block_id_" + block.id + "');\n";
};

Blockly.Blocks["maze_turnLeft"] = {
  /**
   * Block for moving forward.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      message0: Blockly.Msg.MAZE_TURN_LEFT,
      previousStatement: null,
      nextStatement: null,
      colour: Maze.Blocks.MOVEMENT_HUE,
      tooltip: Blockly.Msg.MAZE_TURN_LEFT_TOOLTIP
    });
  }
};

Blockly.JavaScript["maze_turnLeft"] = function(block) {
  // Generate JavaScript for turning left or right.

  return "turnLeft('block_id_" + block.id + "');\n";
};

Blockly.Blocks["maze_if"] = {
  /**
   * Block for 'if' conditional if there is a path.
   * @this Blockly.Block
   */
  init: function() {
    var DIRECTIONS = [
      [Blockly.Msg.MAZE_PATH_AHEAD, "isPathForward"],
      [Blockly.Msg.MAZE_PATH_LEFT, "isPathLeft"],
      [Blockly.Msg.MAZE_PATH_RIGHT, "isPathRight"]
    ];
    // Append arrows to direction messages.
    DIRECTIONS[1][0] += Maze.Blocks.LEFT_TURN;
    DIRECTIONS[2][0] += Maze.Blocks.RIGHT_TURN;
    this.setColour(Maze.Blocks.LOGIC_HUE);
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(DIRECTIONS),
      "DIR"
    );
    this.appendStatementInput("DO").appendField(Blockly.Msg.MAZE_DO_CODE);
    this.setTooltip(Blockly.Msg.MAZE_IF_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript["maze_if"] = function(block) {
  // Generate JavaScript for 'if' conditional if there is a path.
  var argument = block.getFieldValue("DIR") + "('block_id_" + block.id + "')";
  var branch = Blockly.JavaScript.statementToCode(block, "DO");
  var code = "if (" + argument + ") {\n" + branch + "}\n";
  return code;
};

Blockly.Blocks["maze_ifElse"] = {
  /**
   * Block for 'if/else' conditional if there is a path.
   * @this Blockly.Block
   */
  init: function() {
    var DIRECTIONS = [
      [Blockly.Msg.MAZE_PATH_AHEAD, "isPathForward"],
      [Blockly.Msg.MAZE_PATH_LEFT, "isPathLeft"],
      [Blockly.Msg.MAZE_PATH_RIGHT, "isPathRight"]
    ];
    // Append arrows to direction messages.
    DIRECTIONS[1][0] += Maze.Blocks.LEFT_TURN;
    DIRECTIONS[2][0] += Maze.Blocks.RIGHT_TURN;
    this.setColour(Maze.Blocks.LOGIC_HUE);
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(DIRECTIONS),
      "DIR"
    );
    this.appendStatementInput("DO").appendField(Blockly.Msg.MAZE_DO_CODE);
    this.appendStatementInput("ELSE").appendField(Blockly.Msg.MAZE_ELSE_CODE);
    this.setTooltip(Blockly.Msg.MAZE_IF_ELSE_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript["maze_ifElse"] = function(block) {
  // Generate JavaScript for 'if/else' conditional if there is a path.
  var argument = block.getFieldValue("DIR") + "('block_id_" + block.id + "')";
  var branch0 = Blockly.JavaScript.statementToCode(block, "DO");
  var branch1 = Blockly.JavaScript.statementToCode(block, "ELSE");
  var code =
    "if (" + argument + ") {\n" + branch0 + "} else {\n" + branch1 + "}\n";
  return code;
};

Blockly.Blocks["maze_forever"] = {
  /**
   * Block for repeat loop.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Maze.Blocks.LOOPS_HUE);
    this.appendDummyInput()
      .appendField(Blockly.Msg.MAZE_REPEAT_UNTIL)
      .appendField(new Blockly.FieldImage(Maze.SKIN.marker, 12, 16));
    this.appendStatementInput("DO").appendField(Blockly.Msg.MAZE_DO_CODE);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.Msg.MAZE_WHILE_TOOLTIP);
  }
};

Blockly.JavaScript["maze_forever"] = function(block) {
  // Generate JavaScript for repeat loop.
  var branch = Blockly.JavaScript.statementToCode(block, "DO");
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch =
      Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(
        /%1/g,
        "'block_id_" + block.id + "'"
      ) + branch;
  }
  return "while (notDone()) {\n" + branch + "}\n";
};

Blockly.Blocks["maze_repeat"] = {
  /**
   * Block for moving forward.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      message0: Blockly.Msg.MAZE_REPEAT,
      args0: [
        {
          type: "field_number",
          name: "TIMES",
          value: 10,
          min: 0,
          precision: 1
        }
      ],
      message1: Blockly.Msg.MAZE_REPEAT_DO,
      args1: [
        {
          type: "input_statement",
          name: "DO"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      style: "loop_blocks",
      tooltip: "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
      helpUrl: "%{BKY_CONTROLS_REPEAT_HELPURL}"
    });
  }
};

Blockly.JavaScript["maze_repeat"] = function(block) {
  // Repeat n times.
  if (block.getField("TIMES")) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue("TIMES")));
  } else {
    // External number.
    var repeats =
      Blockly.JavaScript.valueToCode(
        block,
        "TIMES",
        Blockly.JavaScript.ORDER_ASSIGNMENT
      ) || "0";
  }
  var branch = Blockly.JavaScript.statementToCode(block, "DO");
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code = "";
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
    "count",
    Blockly.Variables.NAME_TYPE
  );
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
      "repeat_end",
      Blockly.Variables.NAME_TYPE
    );
    code += "var " + endVar + " = " + repeats + ";\n";
  }
  code +=
    "for (var " +
    loopVar +
    " = 0; " +
    loopVar +
    " < " +
    endVar +
    "; " +
    loopVar +
    "++) {\n" +
    branch +
    "}\n";
  return code;
};

Blockly.Blocks["maze_collect"] = {
  /**
   * Block for collect.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      message0: Blockly.Msg.MAZE_COLLECT,
      previousStatement: null,
      nextStatement: null,
      colour: Maze.Blocks.COLLECT,
      tooltip: ""
    });
  }
};

Blockly.JavaScript["maze_collect"] = function(block) {
  // Generate JavaScript for moving forward.
  return "collect('block_id_" + block.id + "');\n";
};
