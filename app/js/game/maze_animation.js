Maze.pidList = [];
numberOfSteps = 0;
points = 0;
var numberOfTries = 1;

numberOfBlocks = 0;

console.log("numberOfSteps", numberOfSteps);

Maze.constrainDirection4 = function(d) {
  d = Math.round(d) % 4;
  if (d < 0) {
    d += 4;
  }
  return d;
};

/**
 * Keep the direction within 0-15, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Maze.constrainDirection16 = function(d) {
  d = Math.round(d) % 16;
  if (d < 0) {
    d += 16;
  }
  return d;
};

Maze.move = function(direction, id) {
  if (!Maze.isPath(direction, null)) {
    Maze.log.push(["fail_" + (direction ? "backward" : "forward"), id]);
    throw false;
  }
  // If moving backward, flip the effective direction.
  var effectiveDirection = Maze.pegmanD + direction;
  var command;
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      Maze.pegmanY--;
      command = "north";
      break;
    case Maze.DirectionType.EAST:
      Maze.pegmanX++;
      command = "east";
      break;
    case Maze.DirectionType.SOUTH:
      Maze.pegmanY++;
      command = "south";
      break;
    case Maze.DirectionType.WEST:
      Maze.pegmanX--;
      command = "west";
      break;
  }
  numberOfSteps++;
  console.log("numberOfSteps", numberOfSteps);
  Maze.log.push([command, id]);
};

/**
 * Turn pegman left or right.
 * @param {number} direction Direction to turn (0 = left, 1 = right).
 * @param {string} id ID of block that triggered this action.
 */
Maze.turn = function(direction, id) {
  if (direction) {
    // Right turn (clockwise).
    Maze.pegmanD++;
    Maze.log.push(["right", id]);
  } else {
    // Left turn (counterclockwise).
    Maze.pegmanD--;
    Maze.log.push(["left", id]);
  }
  Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD);
};

/**
 * Is there a path next to pegman?
 * @param {number} direction Direction to look
 *     (0 = forward, 1 = right, 2 = backward, 3 = left).
 * @param {?string} id ID of block that triggered this action.
 *     Null if called as a helper function in Maze.move().
 * @return {boolean} True if there is a path.
 */
Maze.isPath = function(direction, id) {
  var effectiveDirection = Maze.pegmanD + direction;
  var square;
  var command;
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      square =
        Maze.map[Maze.pegmanY - 1] && Maze.map[Maze.pegmanY - 1][Maze.pegmanX];
      command = "look_north";
      break;
    case Maze.DirectionType.EAST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX + 1];
      command = "look_east";
      break;
    case Maze.DirectionType.SOUTH:
      square =
        Maze.map[Maze.pegmanY + 1] && Maze.map[Maze.pegmanY + 1][Maze.pegmanX];
      command = "look_south";
      break;
    case Maze.DirectionType.WEST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX - 1];
      command = "look_west";
      break;
  }
  if (id) {
    Maze.log.push([command, id]);
  }
  return square !== Maze.SquareType.WALL && square !== undefined;
};

/**
 * Is the player at the finish marker?
 * @return {boolean} True if not done, false if done.
 */
Maze.notDone = function() {
  return Maze.pegmanX != Maze.finish_.x || Maze.pegmanY != Maze.finish_.y;
};

Maze.collect = function(direction, id) {
  var effectiveDirection = Maze.pegmanD + direction;
  var square;
  var command;
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      square =
        Maze.map[Maze.pegmanY - 1] && Maze.map[Maze.pegmanY - 1][Maze.pegmanX];
      command = "collect";
      break;
    case Maze.DirectionType.EAST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX + 1];
      command = "collect";
      break;
    case Maze.DirectionType.SOUTH:
      square =
        Maze.map[Maze.pegmanY + 1] && Maze.map[Maze.pegmanY + 1][Maze.pegmanX];
      command = "collect";
      break;
    case Maze.DirectionType.WEST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX - 1];
      command = "collect";
      break;
  }
  if (id) {
    Maze.log.push([command, id]);
  }
  return square !== Maze.SquareType.WALL && square !== undefined;
};

Maze.displayPegman = function(x, y, d, opt_angle) {
  var pegmanIcon = document.getElementById("pegman");
  pegmanIcon.setAttribute(
    "x",
    x * Maze.SQUARE_SIZE - d * Maze.PEGMAN_WIDTH + 1
  );
  pegmanIcon.setAttribute(
    "y",
    Maze.SQUARE_SIZE * (y + 0.5) - Maze.PEGMAN_HEIGHT / 2 - 8
  );
  if (opt_angle) {
    pegmanIcon.setAttribute(
      "transform",
      "rotate(" +
        opt_angle +
        ", " +
        (x * Maze.SQUARE_SIZE + Maze.SQUARE_SIZE / 2) +
        ", " +
        (y * Maze.SQUARE_SIZE + Maze.SQUARE_SIZE / 2) +
        ")"
    );
  } else {
    pegmanIcon.setAttribute("transform", "rotate(0, 0, 0)");
  }

  var clipRect = document.getElementById("clipRect");
  clipRect.setAttribute("x", x * Maze.SQUARE_SIZE + 1);
  clipRect.setAttribute("y", pegmanIcon.getAttribute("y"));
};

Maze.schedule = function(startPos, endPos) {
  var deltas = [
    (endPos[0] - startPos[0]) / 4,
    (endPos[1] - startPos[1]) / 4,
    (endPos[2] - startPos[2]) / 4
  ];
  Maze.displayPegman(
    startPos[0] + deltas[0],
    startPos[1] + deltas[1],
    Maze.constrainDirection16(startPos[2] + deltas[2])
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayPegman(
        startPos[0] + deltas[0] * 2,
        startPos[1] + deltas[1] * 2,
        Maze.constrainDirection16(startPos[2] + deltas[2] * 2)
      );
    }, Maze.stepSpeed)
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayPegman(
        startPos[0] + deltas[0] * 3,
        startPos[1] + deltas[1] * 3,
        Maze.constrainDirection16(startPos[2] + deltas[2] * 3)
      );
    }, Maze.stepSpeed * 2)
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayPegman(
        endPos[0],
        endPos[1],
        Maze.constrainDirection16(endPos[2])
      );
    }, Maze.stepSpeed * 3)
  );
};

/**
 * Display the look icon at Pegman's current location,
 * in the specified direction.
 * @param {!Maze.DirectionType} d Direction (0 - 3).
 */
Maze.scheduleLook = function(d) {
  var x = Maze.pegmanX;
  var y = Maze.pegmanY;
  switch (d) {
    case Maze.DirectionType.NORTH:
      x += 0.5;
      break;
    case Maze.DirectionType.EAST:
      x += 1;
      y += 0.5;
      break;
    case Maze.DirectionType.SOUTH:
      x += 0.5;
      y += 1;
      break;
    case Maze.DirectionType.WEST:
      y += 0.5;
      break;
  }
  x *= Maze.SQUARE_SIZE;
  y *= Maze.SQUARE_SIZE;
  var deg = d * 90 - 45;

  var lookIcon = document.getElementById("look");
  lookIcon.setAttribute(
    "transform",
    "translate(" + x + ", " + y + ") " + "rotate(" + deg + " 0 0) scale(.4)"
  );
  var paths = lookIcon.getElementsByTagName("path");
  lookIcon.style.display = "inline";
  for (var i = 0, path; (path = paths[i]); i++) {
    Maze.scheduleLookStep(path, Maze.stepSpeed * i);
  }
};

/**
 * Schedule one of the 'look' icon's waves to appear, then disappear.
 * @param {!Element} path Element to make appear.
 * @param {number} delay Milliseconds to wait before making wave appear.
 */
Maze.scheduleLookStep = function(path, delay) {
  Maze.pidList.push(
    setTimeout(function() {
      path.style.display = "inline";
      setTimeout(function() {
        path.style.display = "none";
      }, Maze.stepSpeed * 2);
    }, delay)
  );
};

/**
 * Schedule the animations and sounds for a failed move.
 * @param {boolean} forward True if forward, false if backward.
 */
Maze.scheduleFail = function(forward) {
  var deltaX = 0;
  var deltaY = 0;
  switch (Maze.pegmanD) {
    case Maze.DirectionType.NORTH:
      deltaY = -1;
      break;
    case Maze.DirectionType.EAST:
      deltaX = 1;
      break;
    case Maze.DirectionType.SOUTH:
      deltaY = 1;
      break;
    case Maze.DirectionType.WEST:
      deltaX = -1;
      break;
  }
  if (!forward) {
    deltaX = -deltaX;
    deltaY = -deltaY;
  }
  if (Maze.SKIN.crashType == Maze.CRASH_STOP) {
    // Bounce bounce.
    deltaX /= 4;
    deltaY /= 4;
    var direction16 = Maze.constrainDirection16(Maze.pegmanD * 4);
    Maze.displayPegman(
      Maze.pegmanX + deltaX,
      Maze.pegmanY + deltaY,
      direction16
    );
    BlocklyGames.workspace.getAudioManager().play("fail", 0.5);
    Maze.pidList.push(
      setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
      }, Maze.stepSpeed)
    );
    Maze.pidList.push(
      setTimeout(function() {
        Maze.displayPegman(
          Maze.pegmanX + deltaX,
          Maze.pegmanY + deltaY,
          direction16
        );
        BlocklyGames.workspace.getAudioManager().play("fail", 0.5);
      }, Maze.stepSpeed * 2)
    );
    Maze.pidList.push(
      setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
      }, Maze.stepSpeed * 3)
    );
  } else {
    // Add a small random delta away from the grid.
    var deltaZ = (Math.random() - 0.5) * 10;
    var deltaD = (Math.random() - 0.5) / 2;
    deltaX += (Math.random() - 0.5) / 4;
    deltaY += (Math.random() - 0.5) / 4;
    deltaX /= 8;
    deltaY /= 8;
    var acceleration = 0;
    if (Maze.SKIN.crashType == Maze.CRASH_FALL) {
      acceleration = 0.01;
    }
    Maze.pidList.push(
      setTimeout(function() {
        BlocklyGames.workspace.getAudioManager().play("fail", 0.5);
      }, Maze.stepSpeed * 2)
    );
    var setPosition = function(n) {
      return function() {
        var direction16 = Maze.constrainDirection16(
          Maze.pegmanD * 4 + deltaD * n
        );
        Maze.displayPegman(
          Maze.pegmanX + deltaX * n,
          Maze.pegmanY + deltaY * n,
          direction16,
          deltaZ * n
        );
        deltaY += acceleration;
      };
    };
    // 100 frames should get Pegman offscreen.
    for (var i = 1; i < 100; i++) {
      Maze.pidList.push(setTimeout(setPosition(i), (Maze.stepSpeed * i) / 2));
    }
  }
};

/**
 * Schedule the animations and sound for a victory dance.
 * @param {boolean} sound Play the victory sound.
 */
Maze.scheduleFinish = function(sound) {
  var direction16 = Maze.constrainDirection16(Maze.pegmanD * 4);
  Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
  // if (sound) {
  //   BlocklyGames.workspace.getAudioManager().play("win", 0.5);
  // }
  Maze.stepSpeed = 150; // Slow down victory animation a bit.
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 18);
    }, Maze.stepSpeed)
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
    }, Maze.stepSpeed * 2)
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, direction16);
    }, Maze.stepSpeed * 3)
  );
};

Maze.animate = function() {
  var action = Maze.log.shift();

  if (!action) {
    Game.highlight(null);
    Maze.levelHelp();
    return;
  }

  Game.highlight(action[1]);

  switch (action[0]) {
    case "north":
      Maze.schedule(
        [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
        [Maze.pegmanX, Maze.pegmanY - 1, Maze.pegmanD * 4]
      );
      Maze.pegmanY--;
      break;
    case "east":
      Maze.schedule(
        [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
        [Maze.pegmanX + 1, Maze.pegmanY, Maze.pegmanD * 4]
      );
      Maze.pegmanX++;
      break;
    case "south":
      Maze.schedule(
        [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
        [Maze.pegmanX, Maze.pegmanY + 1, Maze.pegmanD * 4]
      );
      Maze.pegmanY++;
      break;
    case "west":
      Maze.schedule(
        [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
        [Maze.pegmanX - 1, Maze.pegmanY, Maze.pegmanD * 4]
      );
      Maze.pegmanX--;
      break;
    case "look_north":
      Maze.scheduleLook(Maze.DirectionType.NORTH);
      break;
    case "look_east":
      Maze.scheduleLook(Maze.DirectionType.EAST);
      break;
    case "look_south":
      Maze.scheduleLook(Maze.DirectionType.SOUTH);
      break;
    case "look_west":
      Maze.scheduleLook(Maze.DirectionType.WEST);
      break;
    case "fail_forward":
      Maze.scheduleFail(true);
      break;
    case "fail_backward":
      Maze.scheduleFail(false);
      break;
    case "left":
      Maze.schedule(
        [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
        [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4 - 4]
      );
      Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD - 1);
      break;
    case "right":
      Maze.schedule(
        [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
        [Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4 + 4]
      );
      Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD + 1);
      break;
    case "collect":
      Maze.flowers.map(flower => {
        if (Maze.pegmanX === flower.x && Maze.pegmanY === flower.y) {
          var flowerIcon = document.getElementById("flower" + flower.id);
          if (flowerIcon.style.opacity === "0") {
            alert("Não há nada para coletar");
          } else {
            flowerIcon.style.opacity = "0";
            points = points + 10;
            document.getElementById("points").innerHTML = points;
            console.log("points", points);
          }
        }
      });

      break;
    case "finish":
      Maze.scheduleFinish(true);
      //BlocklyInterface.saveToLocalStorage();
      setTimeout(GameDialogs.congratulations, 1000);
  }

  Maze.pidList.push(setTimeout(Maze.animate, Maze.stepSpeed * 5));
};
