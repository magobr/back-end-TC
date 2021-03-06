/**
 * ids de animação das tarefas que estão sendo executadas pelo rei.
 */
Maze.pidList = [];

numberOfSteps = 0;
points = 0;
var numberOfTries = 1;

numberOfBlocks = 0;

/**
 * Keep the direction within 0-3, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
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

/**
 * Attempt to move pegman forward or backward.
 * @param {number} direction Direction to move (0 = forward, 2 = backward).
 * @param {string} id ID of block that triggered this action.
 * @throws {true} If the end of the maze is reached.
 * @throws {false} If Pegman collides with a wall.
 */
Maze.move = function(direction, id) {
  if (!Maze.isPath(direction, null)) {
    Maze.log.push(["fail_" + (direction ? "backward" : "forward"), id]);
    throw false;
  }
  // If moving backward, flip the effective direction.
  var effectiveDirection = Maze.kingD + direction;
  var command;
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      Maze.kingY--;
      command = "north";
      break;
    case Maze.DirectionType.EAST:
      Maze.kingX++;
      command = "east";
      break;
    case Maze.DirectionType.SOUTH:
      Maze.kingY++;
      command = "south";
      break;
    case Maze.DirectionType.WEST:
      Maze.kingX--;
      command = "west";
      break;
  }

  Maze.log.push([command, id]);
};

/**
 * Vira o rei para esquerda ou direita.
 * @param {number} direction Direção para virar (0 = esquerda, 1 = direita).
 * @param {string} id ID do bloco que chamou essa ação.
 */
Maze.turn = function(direction, id) {
  if (direction) {
    // Vira para direita.
    Maze.kingD++;
    Maze.log.push(["right", id]);
  } else {
    // Vira para esquerda.
    Maze.kingD--;
    Maze.log.push(["left", id]);
  }
  Maze.kingD = Maze.constrainDirection4(Maze.kingD);
};

/**
 * Existe caminho próximo ao rei?
 * @param {number} direction Direção para olhar
 *     (0 = para frente, 1 = direita, 2 =  para trás, 3 = esquerda).
 * @param {?string} id ID do bloco que chamou essa ação.
 *     Null if called as a helper function in Maze.move().
 * @return {boolean} True if there is a path.
 */
Maze.isPath = function(direction, id) {
  var effectiveDirection = Maze.kingD + direction;
  var square;
  var command;
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      square = Maze.map[Maze.kingY - 1] && Maze.map[Maze.kingY - 1][Maze.kingX];
      command = "look_north";
      break;
    case Maze.DirectionType.EAST:
      square = Maze.map[Maze.kingY][Maze.kingX + 1];
      command = "look_east";
      break;
    case Maze.DirectionType.SOUTH:
      square = Maze.map[Maze.kingY + 1] && Maze.map[Maze.kingY + 1][Maze.kingX];
      command = "look_south";
      break;
    case Maze.DirectionType.WEST:
      square = Maze.map[Maze.kingY][Maze.kingX - 1];
      command = "look_west";
      break;
  }
  if (id) {
    Maze.log.push([command, id]);
  }
  return square !== Maze.SquareType.WALL && square !== undefined;
};

/**
 * Se o rei estiver na mesma posição da coroa retorna false senão retorna true.
 */
Maze.notDone = function() {
  return Maze.kingX != Maze.finish_.x || Maze.kingY != Maze.finish_.y;
};

Maze.collect = function(id) {
  if (id) {
    Maze.log.push(["collect", id]);
  }
};

Maze.displayKing = function(x, y, d, opt_angle) {
  var kingIcon = document.getElementById("king");
  kingIcon.setAttribute("x", x * Maze.SQUARE_SIZE - d * Maze.KING_WIDTH + 1);
  kingIcon.setAttribute(
    "y",
    Maze.SQUARE_SIZE * (y + 0.5) - Maze.KING_HEIGHT / 2 - 8
  );
  if (opt_angle) {
    kingIcon.setAttribute(
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
    kingIcon.setAttribute("transform", "rotate(0, 0, 0)");
  }

  var clipRect = document.getElementById("clipRect");
  clipRect.setAttribute("x", x * Maze.SQUARE_SIZE + 1);
  clipRect.setAttribute("y", kingIcon.getAttribute("y"));
};

/**
 * Prepara as animações para mover ou virar.
 */
Maze.schedule = function(startPos, endPos) {
  var deltas = [
    (endPos[0] - startPos[0]) / 4,
    (endPos[1] - startPos[1]) / 4,
    (endPos[2] - startPos[2]) / 4
  ];
  Maze.displayKing(
    startPos[0] + deltas[0],
    startPos[1] + deltas[1],
    Maze.constrainDirection16(startPos[2] + deltas[2])
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayKing(
        startPos[0] + deltas[0] * 2,
        startPos[1] + deltas[1] * 2,
        Maze.constrainDirection16(startPos[2] + deltas[2] * 2)
      );
    }, Maze.stepSpeed)
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayKing(
        startPos[0] + deltas[0] * 3,
        startPos[1] + deltas[1] * 3,
        Maze.constrainDirection16(startPos[2] + deltas[2] * 3)
      );
    }, Maze.stepSpeed * 2)
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayKing(
        endPos[0],
        endPos[1],
        Maze.constrainDirection16(endPos[2])
      );
    }, Maze.stepSpeed * 3)
  );
};

/**
 * Mostra o ícone "look" na localização atual do rei na direção específica.
 */
Maze.scheduleLook = function(d) {
  var x = Maze.kingX;
  var y = Maze.kingY;
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
 * Prepara o ícone de "look" para aparecer e desaparecer.
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
 * Prepara as animações e sons para um movimento de falha.
 */
Maze.scheduleFail = function(forward) {
  var deltaX = 0;
  var deltaY = 0;
  switch (Maze.kingD) {
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
    deltaX /= 4;
    deltaY /= 4;
    var direction16 = Maze.constrainDirection16(Maze.kingD * 4);
    Maze.displayKing(Maze.kingX + deltaX, Maze.kingY + deltaY, direction16);
    Game.workspace.getAudioManager().play("fail", 0.5);
    Maze.pidList.push(
      setTimeout(function() {
        Maze.displayKing(Maze.kingX, Maze.kingY, direction16);
      }, Maze.stepSpeed)
    );
    Maze.pidList.push(
      setTimeout(function() {
        Maze.displayKing(Maze.kingX + deltaX, Maze.kingY + deltaY, direction16);
        Game.workspace.getAudioManager().play("fail", 0.5);
      }, Maze.stepSpeed * 2)
    );
    Maze.pidList.push(
      setTimeout(function() {
        Maze.displayKing(Maze.kingX, Maze.kingY, direction16);
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
        Game.workspace.getAudioManager().play("fail", 0.5);
      }, Maze.stepSpeed * 2)
    );
    var setPosition = function(n) {
      return function() {
        var direction16 = Maze.constrainDirection16(
          Maze.kingD * 4 + deltaD * n
        );
        Maze.displayKing(
          Maze.kingX + deltaX * n,
          Maze.kingY + deltaY * n,
          direction16,
          deltaZ * n
        );
        deltaY += acceleration;
      };
    };
    for (var i = 1; i < 100; i++) {
      Maze.pidList.push(setTimeout(setPosition(i), (Maze.stepSpeed * i) / 2));
    }
  }
};

/**
 * Prepara as animações e os sons para uma dança da vitória.
 */
Maze.scheduleFinish = function(sound) {
  var direction16 = Maze.constrainDirection16(Maze.kingD * 4);
  Maze.displayKing(Maze.kingX, Maze.kingY, 16);
  if (sound) {
    Game.workspace.getAudioManager().play("win", 0.5);
  }
  Maze.stepSpeed = 150;
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayKing(Maze.kingX, Maze.kingY, 18);
    }, Maze.stepSpeed)
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayKing(Maze.kingX, Maze.kingY, 16);
    }, Maze.stepSpeed * 2)
  );
  Maze.pidList.push(
    setTimeout(function() {
      Maze.displayKing(Maze.kingX, Maze.kingY, direction16);
    }, Maze.stepSpeed * 3)
  );
};

/**
 * Reproduz as animações das ações do rei.
 */
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
        [Maze.kingX, Maze.kingY, Maze.kingD * 4],
        [Maze.kingX, Maze.kingY - 1, Maze.kingD * 4]
      );
      Maze.kingY--;
      numberOfSteps++;
      break;
    case "east":
      Maze.schedule(
        [Maze.kingX, Maze.kingY, Maze.kingD * 4],
        [Maze.kingX + 1, Maze.kingY, Maze.kingD * 4]
      );
      Maze.kingX++;
      numberOfSteps++;
      break;
    case "south":
      Maze.schedule(
        [Maze.kingX, Maze.kingY, Maze.kingD * 4],
        [Maze.kingX, Maze.kingY + 1, Maze.kingD * 4]
      );
      Maze.kingY++;
      numberOfSteps++;
      break;
    case "west":
      Maze.schedule(
        [Maze.kingX, Maze.kingY, Maze.kingD * 4],
        [Maze.kingX - 1, Maze.kingY, Maze.kingD * 4]
      );
      Maze.kingX--;
      numberOfSteps++;
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
        [Maze.kingX, Maze.kingY, Maze.kingD * 4],
        [Maze.kingX, Maze.kingY, Maze.kingD * 4 - 4]
      );
      Maze.kingD = Maze.constrainDirection4(Maze.kingD - 1);
      break;
    case "right":
      Maze.schedule(
        [Maze.kingX, Maze.kingY, Maze.kingD * 4],
        [Maze.kingX, Maze.kingY, Maze.kingD * 4 + 4]
      );
      Maze.kingD = Maze.constrainDirection4(Maze.kingD + 1);
      break;
    case "collect":
      Maze.flowers.map(flower => {
        if (Maze.kingX === flower.x && Maze.kingY === flower.y) {
          var flowerIcon = document.getElementById("flower" + flower.id);
          if (flowerIcon.style.opacity === "0") {
            alert("Não há nada para coletar");
          } else {
            flowerIcon.style.opacity = "0";
            points = points + 10;
            document.getElementById("points").innerHTML = points;
          }
        }
      });
      if (Maze.map[Maze.kingY][Maze.kingX] !== Maze.SquareType.COLLECT) {
        alert("Não há nada para coletar");
      }

      break;
    case "finish":
      Maze.scheduleFinish(true);
      setTimeout(GameDialogs.congratulations, 1000);

      if (Game.LEVEL >= 5) {
        (async () => {
          await fetch("/py", {
            method: "post",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              numberOfBlocks: numberOfBlocks,
              numberOfSteps: numberOfSteps,
              numberOfTries: numberOfTries,
              points: points,
              level: Game.LEVEL
            })
          });
        })();
      }
  }

  Maze.pidList.push(setTimeout(Maze.animate, Maze.stepSpeed * 5));
};
