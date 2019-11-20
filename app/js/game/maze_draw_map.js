Maze.ROWS = Maze.map.length;
Maze.COLS = Maze.map[0].length;
Maze.SQUARE_SIZE = 50;
Maze.KING_HEIGHT = 52;
Maze.KING_WIDTH = 49;

Maze.MAZE_WIDTH = Maze.SQUARE_SIZE * Maze.COLS;
Maze.MAZE_HEIGHT = Maze.SQUARE_SIZE * Maze.ROWS;
Maze.PATH_WIDTH = Maze.SQUARE_SIZE / 3;

Maze.tile_SHAPES = {
  "10010": [4, 0], // Becos-sem-saída
  "10001": [3, 3],
  "11000": [0, 1],
  "10100": [0, 2],
  "11010": [4, 1], // Vertical
  "10101": [3, 2], // Horizontal
  "10110": [0, 0], // Esquinas
  "10011": [2, 0],
  "11001": [4, 2],
  "11100": [2, 3],
  "11110": [1, 1], // Junções
  "10111": [1, 0],
  "11011": [2, 1],
  "11101": [1, 2],
  "11111": [2, 2], // Cruzamento
  null0: [4, 3], // Vazio
  null1: [3, 0],
  null2: [3, 1],
  null3: [0, 3],
  null4: [1, 3]
};

Maze.drawMap = function() {
  var svg = document.getElementById("svgMaze");
  var scale = Math.max(Maze.ROWS, Maze.COLS) * Maze.SQUARE_SIZE;
  svg.setAttribute("viewBox", "0 0 " + scale + " " + scale);

  // Draw the outer square.
  var square = document.createElementNS(Blockly.SVG_NS, "rect");
  square.setAttribute("width", Maze.MAZE_WIDTH);
  square.setAttribute("height", Maze.MAZE_HEIGHT);
  square.setAttribute("fill", "#F1EEE7");
  square.setAttribute("stroke-width", 1);
  square.setAttribute("stroke", "#CCB");
  svg.appendChild(square);

  if (Maze.SKIN.background) {
    var tile = document.createElementNS(Blockly.SVG_NS, "image");
    tile.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      Maze.SKIN.background
    );
    tile.setAttribute("height", Maze.MAZE_HEIGHT);
    tile.setAttribute("width", Maze.MAZE_WIDTH);
    tile.setAttribute("x", 0);
    tile.setAttribute("y", 0);
    svg.appendChild(tile);
  }

  if (Maze.SKIN.graph) {
    // Desenha as linhas de grade.
    var offset = Maze.SQUARE_SIZE;
    for (var k = 0; k < Maze.ROWS; k++) {
      var h_line = document.createElementNS(Blockly.SVG_NS, "line");
      h_line.setAttribute("y1", k * Maze.SQUARE_SIZE + offset);
      h_line.setAttribute("x2", Maze.MAZE_WIDTH);
      h_line.setAttribute("y2", k * Maze.SQUARE_SIZE + offset);
      h_line.setAttribute("stroke", Maze.SKIN.graph);
      h_line.setAttribute("stroke-width", 1);
      svg.appendChild(h_line);
    }
    for (var k = 0; k < Maze.COLS; k++) {
      var v_line = document.createElementNS(Blockly.SVG_NS, "line");
      v_line.setAttribute("x1", k * Maze.SQUARE_SIZE + offset);
      v_line.setAttribute("x2", k * Maze.SQUARE_SIZE + offset);
      v_line.setAttribute("y2", Maze.MAZE_HEIGHT);
      v_line.setAttribute("stroke", Maze.SKIN.graph);
      v_line.setAttribute("stroke-width", 1);
      svg.appendChild(v_line);
    }
  }

  // Draw the tiles making up the maze map.

  // Return a value of '0' if the specified square is wall or out of bounds,
  // '1' otherwise (empty, start, finish).
  var normalize = function(x, y) {
    if (x < 0 || x >= Maze.COLS || y < 0 || y >= Maze.ROWS) {
      return "0";
    }
    return Maze.map[y][x] == Maze.SquareType.WALL ? "0" : "1";
  };

  // Calcula e desenha o piso para cada quadrado.
  var tileId = 0;
  var flowerId = 0;
  for (var y = 0; y < Maze.ROWS; y++) {
    for (var x = 0; x < Maze.COLS; x++) {
      // Calcula a forma do piso do caminho.
      var tileShape =
        normalize(x, y) +
        normalize(x, y - 1) + // Norte.
        normalize(x + 1, y) + // Oeste.
        normalize(x, y + 1) + // Sul.
        normalize(x - 1, y); // Leste.

      // Desenha o piso do caminho.
      if (!Maze.tile_SHAPES[tileShape]) {
        // Empty square.  Use null0 for large areas, with null1-4 for borders.
        // Add some randomness to avoid large empty spaces.
        if (tileShape == "00000" && Math.random() > 0.3) {
          tileShape = "null0";
        } else {
          tileShape = "null" + Math.floor(1 + Math.random() * 4);
        }
      }
      var left = Maze.tile_SHAPES[tileShape][0];
      var top = Maze.tile_SHAPES[tileShape][1];
      // Elemento clipPath do piso.
      var tileClip = document.createElementNS(Blockly.SVG_NS, "clipPath");
      tileClip.setAttribute("id", "tileClipPath" + tileId);
      var clipRect = document.createElementNS(Blockly.SVG_NS, "rect");
      clipRect.setAttribute("width", Maze.SQUARE_SIZE);
      clipRect.setAttribute("height", Maze.SQUARE_SIZE);

      clipRect.setAttribute("x", x * Maze.SQUARE_SIZE);
      clipRect.setAttribute("y", y * Maze.SQUARE_SIZE);

      tileClip.appendChild(clipRect);
      svg.appendChild(tileClip);
      // Sprite do piso.
      var tile = document.createElementNS(Blockly.SVG_NS, "image");
      tile.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        Maze.SKIN.tiles
      );
      // Posiciona o sprite do piso em relação ao clipRect.
      tile.setAttribute("height", Maze.SQUARE_SIZE * 4);
      tile.setAttribute("width", Maze.SQUARE_SIZE * 5);
      tile.setAttribute("clip-path", "url(#tileClipPath" + tileId + ")");
      tile.setAttribute("x", (x - left) * Maze.SQUARE_SIZE);
      tile.setAttribute("y", (y - top) * Maze.SQUARE_SIZE);
      svg.appendChild(tile);
      tileId++;

      // Adiciona a quantidade certa de flores de acordo com o mapa.
      if (Maze.map[y][x] === Maze.SquareType.COLLECT) {
        var bonus = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "image"
        );
        bonus.setAttribute("id", "flower" + flowerId);
        bonus.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          "../../../static/img/flower.jpg"
        );
        bonus.setAttribute("height", 36);
        bonus.setAttribute("width", 36);
        svg.appendChild(bonus);
        flowerId++;
      }
    }
  }

  // Adiciona a coroa(objetivo do jogo).
  var finishMarker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "image"
  );
  finishMarker.setAttribute("id", "finish");
  finishMarker.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    Maze.SKIN.marker
  );
  finishMarker.setAttribute("height", 36);
  finishMarker.setAttribute("width", 40);
  svg.appendChild(finishMarker);

  // O elemento clipPath do rei, em qual (x, y) é redefinido pelo Maze.displayKing.
  var kingClip = document.createElementNS(Blockly.SVG_NS, "clipPath");
  kingClip.setAttribute("id", "kingClipPath");
  var clipRect = document.createElementNS(Blockly.SVG_NS, "rect");
  clipRect.setAttribute("id", "clipRect");
  clipRect.setAttribute("width", Maze.KING_WIDTH);
  clipRect.setAttribute("height", Maze.KING_HEIGHT);
  kingClip.appendChild(clipRect);
  svg.appendChild(kingClip);

  // Adiciona o rei.
  var kingIcon = document.createElementNS(Blockly.SVG_NS, "image");
  kingIcon.setAttribute("id", "king");
  kingIcon.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    Maze.SKIN.sprite
  );
  kingIcon.setAttribute("height", Maze.KING_HEIGHT);
  kingIcon.setAttribute("width", Maze.KING_WIDTH * 21); // 49 * 21 = 1029
  kingIcon.setAttribute("clip-path", "url(#kingClipPath)");
  svg.appendChild(kingIcon);
};
