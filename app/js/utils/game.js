"use strict";
goog.provide("Game");

Game.IS_HTML = /\.html$/.test(window.location.pathname);

Game.clamp = function(min, val, max) {
  if (val < min) {
    val = min;
  } else if (val > max) {
    val = max;
  }

  return val;
};

Game.getStringParamFromUrl = function(name, defaultValue) {
  var val = window.location.search.match(
    new RegExp("[?&]" + name + "=([^&]+)")
  );
  return val ? decodeURIComponent(val[1].replace(/\+/g, "%20")) : defaultValue;
};

Game.getNumberParamFromUrl = function(name, minValue, maxValue) {
  var val = Number(Game.getStringParamFromUrl(name, "NaN"));
  return isNaN(val) ? minValue : Game.clamp(minValue, val, maxValue);
};

Game.MAX_LEVEL = 15;

Game.LEVEL = Game.getNumberParamFromUrl("level", 1, Game.MAX_LEVEL);

Game.workspace = null;

Game.importPrettify = function() {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", "../../../static/js/prettify/prettify.css");
  document.head.appendChild(link);
  var script = document.createElement("script");
  script.setAttribute("src", "../../../static/js/prettify/prettify.js");
  document.head.appendChild(script);
};

Game.highlight = function(id, opt_state) {
  if (id) {
    var m = String(id).match(/^block_id_([^']+)$/);
    if (m) {
      id = m[1];
    }
  }
  Game.workspace.highlightBlock(id, opt_state);
};

Game.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch (e) {
    var loadOnce = null;
  }
  if ("BlocklyStorage" in window && window.location.hash.length > 1) {
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Game.workspace);
  } else if (defaultXml) {
    var xml = Blockly.Xml.textToDom(defaultXml);

    Game.workspace.clear();
    Blockly.Xml.domToWorkspace(xml, Game.workspace);
    Game.workspace.clearUndo();
  } else if ("BlocklyStorage" in window) {
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

Game.bindClick = function(el, func) {
  if (typeof el == "string") {
    el = document.querySelector(el);
  }
  el.addEventListener("click", func, true);
  el.addEventListener("touchend", func, true);
};

//
Game.initWorkspace = function() {
  var toolbox = document.getElementById("toolbox");

  var scale = 1 + (1 - Game.LEVEL / Game.MAX_LEVEL) / 3;
  Game.workspace = Blockly.inject("blockly", {
    grid: {
      spacing: 25,
      length: 3,
      colour: "#ccc",
      snap: true
    },
    media: "../../../static/js/blockly/media/",
    toolbox: toolbox,
    trashcan: true,
    zoom: {
      startScale: scale
    },
    scrollbars: true
  });
};

/**
 * Inicializa a caixa de ferramentas.
 */
Game.initToolbox = function(game) {
  var toolbox = document.getElementById("toolbox");
  var block = null;
  var blocks = [];

  blocks = game.blocks[Game.LEVEL - 1];

  for (var index in blocks) {
    block = document.createElement("block");
    block.setAttribute("type", blocks[index]);
    toolbox.appendChild(block);
  }
};

Game.importInterpreter = function() {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", "../../../static/js/utils/acorn_interpreter.js");
  document.head.appendChild(script);
};

/**
 * Direciona para a página index.
 */
Game.indexPage = function() {
  window.location = Game.IS_HTML ? "index.html" : "./";
};

Game.nextLevel = function() {
  if (Game.LEVEL < Game.MAX_LEVEL) {
    window.location =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?level=" +
      (Game.LEVEL + 1);
  } else {
    Game.indexPage();
  }
};

Game.stripCode = function(code) {
  // Retira os números de série.
  return goog.string.trimRight(code.replace(/(,\s*)?'block_id_[^']+'\)/g, ")"));
};

Game.injectReadonly = function(id, xml) {
  var div = document.getElementById(id);
  if (!div.firstChild) {
    var workspace = Blockly.inject(div, { readOnly: true });
    if (typeof xml != "string") {
      xml = xml.join("");
    }
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
  }
};

/**
 * Determina se o evento é indesejado.
 */
Game.eventSpam = function(e) {
  var touchMouseTime = 2000;
  if (
    e.type == "click" &&
    Game.eventSpam.previousType_ == "touchend" &&
    Game.eventSpam.previousDate_ + touchMouseTime > Date.now()
  ) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }

  var doubleClickTime = 400;
  if (
    Game.eventSpam.previousType_ == e.type &&
    Game.eventSpam.previousDate_ + doubleClickTime > Date.now()
  ) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  Game.eventSpam.previousType_ = e.type;
  Game.eventSpam.previousDate_ = Date.now();
  return false;
};

Game.eventSpam.previousType_ = null;
Game.eventSpam.previousDate_ = 0;
