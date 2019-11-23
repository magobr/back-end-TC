Maze.blocks = [
  ["maze_moveForward"],
  ["maze_moveForward", "maze_turnRight", "maze_turnLeft", "maze_collect"],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_repeat",
    "maze_forever"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_repeat",
    "maze_forever"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "controls_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ],
  [
    "maze_moveForward",
    "maze_turnRight",
    "maze_turnLeft",
    "maze_collect",
    "maze_repeat",
    "maze_forever",
    "maze_if",
    "maze_ifElse"
  ]
];

// Constantes de tipos de falhas.
Maze.CRASH_STOP = 1;
Maze.CRASH_SPIN = 2;
Maze.CRASH_FALL = 3;

Maze.SKINS = [
  {
    sprite: "../../../static/img/king.png",
    tiles: "../../../static/img/tiles_garden.png",
    marker: "../../../static/img/crown1.png",
    background: "../../../static/img/garden.png",
    graph: "#ccc",
    look: "#000",
    winSound: ["../../../static/img/win.mp3", "../../../static/img/win.ogg"],
    crashSound: [
      "../../../static/img/fail_pegman.mp3",
      "../../../static/img/fail_pegman.ogg"
    ],
    crashType: Maze.CRASH_STOP
  }
];
Maze.SKIN_ID = Game.getNumberParamFromUrl("skin", 0, Maze.SKINS.length);
Maze.SKIN = Maze.SKINS[Maze.SKIN_ID];

Maze.stepSpeed;

/**
 * Tipos de quadrados no jogo.
 */
Maze.SquareType = {
  WALL: 0,
  OPEN: 1,
  START: 2,
  FINISH: 3,
  COLLECT: 4
};

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
    [0, 0, 0, 4, 1, 3, 0, 0],
    [0, 0, 2, 1, 0, 0, 0, 0],
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
    [0, 0, 1, 4, 0, 0, 0, 0],
    [0, 0, 0, 1, 4, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 3, 1, 4, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Level 6.
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 4, 1, 0, 0],
    [0, 2, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0],
    [0, 4, 1, 1, 1, 4, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 3, 4, 0, 4, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0]
  ],
  // Level 7.
  [
    [0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 0],
    [1, 2, 1, 1, 1, 4, 0, 0],
    [0, 0, 0, 4, 0, 1, 1, 4],
    [0, 0, 1, 1, 4, 1, 0, 1],
    [0, 0, 4, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [3, 0, 0, 0, 1, 1, 0, 0]
  ],
  // Level 8.
  [
    [0, 0, 4, 1, 1, 1, 4, 0],
    [0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 4, 4, 1, 0, 1, 0],
    [0, 1, 0, 0, 4, 1, 1, 0],
    [0, 1, 1, 1, 0, 1, 4, 0],
    [0, 0, 0, 1, 0, 1, 1, 1],
    [0, 2, 1, 1, 0, 1, 0, 3],
    [0, 0, 0, 0, 0, 1, 1, 1]
  ],
  // Level 9.
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 4, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 0, 1, 4, 0, 0],
    [0, 1, 4, 0, 2, 1, 4, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 4, 1, 4, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 4, 1, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  // Level 10.
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 3, 0, 1, 0, 0],
    [0, 4, 1, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 1, 4, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 4, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 1, 1, 0, 0],
    [0, 2, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],

  //level 11

  [
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 4, 0, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 4, 1, 1, 0],
    [0, 3, 0, 0, 1, 1, 0, 0, 1, 0],
    [0, 0, 0, 4, 1, 0, 0, 0, 4, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 2, 1, 4, 1, 1, 1, 1, 0]
  ],

  // level 12
  [
    [2, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 4, 1, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 4, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 1, 4, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 4, 1, 1, 1, 1, 3, 0, 0, 0, 0]
  ],
  //level 13
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 4, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4, 0],
    [0, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 4, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 4, 1, 0, 1, 1, 3, 0, 1, 1, 1, 0]
  ],

  //level 14
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 4, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 4, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 3, 0, 1, 0, 1],
    [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0]
  ],

  //level 15
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 4, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 4, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 4, 0, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 4, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 2, 1, 1, 1, 4, 1, 1, 1, 0, 0]
  ]
][Game.LEVEL];
