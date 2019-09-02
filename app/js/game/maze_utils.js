//BlocklyGames.NAME = 'maze';
Maze.blocks = [
  [
    "maze_moveForward",
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_forever",
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ]
];

Maze.MAX_BLOCKS = [
  undefined, // Level 0.
  Infinity,
  Infinity,
  Infinity,
  Infinity,
  Infinity,
  Infinity,
  Infinity,
  Infinity,
  Infinity,
  Infinity
][Game.LEVEL];

// Crash type constants.
Maze.CRASH_STOP = 1;
Maze.CRASH_SPIN = 2;
Maze.CRASH_FALL = 3;

Maze.SKINS = [
  // sprite: A 1029x51 set of 21 avatar images.
  // tiles: A 250x200 set of 20 map images.
  // marker: A 20x34 goal image.
  // background: An optional 400x450 background image, or false.
  // graph: Colour of optional grid lines, or false.
  // look: Colour of sonar-like look icon.
  // winSound: List of sounds (in various formats) to play when the player wins.
  // crashSound: List of sounds (in various formats) for player crashes.
  // crashType: Behaviour when player crashes (stop, spin, or fall).
  {
    sprite: "../../../static/img/pegman.png",
    tiles: "../../../static/img/tiles_pegman.png",
    marker: "../../../static/img/marker.png",
    background: false,
    graph: false,
    look: "#000",
    winSound: ["../../../static/img/win.mp3", "../../../static/img/win.ogg"],
    crashSound: ["../../../static/img/fail_pegman.mp3", "../../../static/img/fail_pegman.ogg"],
    crashType: Maze.CRASH_STOP
  },
  {
    sprite: "maze/astro.png",
    tiles: "maze/tiles_astro.png",
    marker: "maze/marker.png",
    background: "maze/bg_astro.jpg",
    // Coma star cluster, photo by George Hatfield, used with permission.
    graph: false,
    look: "#fff",
    winSound: ["../../../static/img/win.mp3", "../../../static/img/win.ogg"],
    crashSound: ["maze/fail_astro.mp3", "maze/fail_astro.ogg"],
    crashType: Maze.CRASH_SPIN
  },
  {
    sprite: "maze/panda.png",
    tiles: "maze/tiles_panda.png",
    marker: "maze/marker.png",
    background: "maze/bg_panda.jpg",
    // Spring canopy, photo by Rupert Fleetingly, CC licensed for reuse.
    graph: false,
    look: "#000",
    winSound: ["maze/win.mp3", "maze/win.ogg"],
    crashSound: ["maze/fail_panda.mp3", "maze/fail_panda.ogg"],
    crashType: Maze.CRASH_FALL
  }
];
Maze.SKIN_ID = Game.getNumberParamFromUrl("skin", 0, Maze.SKINS.length);
Maze.SKIN = Maze.SKINS[Maze.SKIN_ID];

/**
 * Milliseconds between each animation frame.
 */
Maze.stepSpeed;

/**
 * The types of squares in the maze, which is represented
 * as a 2D array of SquareType values.
 * @enum {number}
 */
Maze.SquareType = {
  WALL: 0,
  OPEN: 1,
  START: 2,
  FINISH: 3,
  COLLECT: 4
};

// The maze square constants defined above are inlined here
// for ease of reading and writing the static mazes.
Maze.map = [
  // Level 0.
  undefined,
  // Level 1.
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 1, 3, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  // Level 2.
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 4, 3, 0, 0],
    [0, 0, 2, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Level 3.
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 3, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Level 4.
  /**
   * Note, the path continues past the start and the goal in both directions.
   * This is intentionally done so users see the maze is about getting from
   * the start to the goal and not necessarily about moving over every part of
   * the maze, 'mowing the lawn' as Neil calls it.
   */
  [
    [1, 1, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 3, 1],
    [0, 0, 0, 0, 0, 0, 0, 1]
  ],
  // Level 5.
  [
    [1, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 3, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Level 6.
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0],
    [0, 2, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 3, 1, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0]
  ],
  // Level 7.
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0],
    [1, 2, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 3, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Level 8.
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 1],
    [0, 2, 1, 1, 0, 1, 0, 3],
    [0, 0, 0, 0, 0, 1, 1, 1]
  ],
  // Level 9.
  [
    [0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 0, 1, 1, 0],
    [1, 1, 0, 2, 1, 1, 0, 1, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Level 10.
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 3, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 0],
    [0, 2, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]
][Game.LEVEL];
