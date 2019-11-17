"use strict";
goog.provide("Game");

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

/**
 * User's level (e.g. 5).
 */
Game.LEVEL = Game.getNumberParamFromUrl("level", 1, Game.MAX_LEVEL);

Game.workspace = null;

// Game.LANG = Game.getLang();

Game.importPrettify = function() {
  //<link rel="stylesheet" href="./prettify.css">
  //<script src="./prettify.js"></script>
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
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ("BlocklyStorage" in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Game.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    // Clear the workspace to avoid merge.
    Game.workspace.clear();
    Blockly.Xml.domToWorkspace(xml, Game.workspace);
    Game.workspace.clearUndo();
  } else if ("BlocklyStorage" in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
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
  // Interpolate translated messages into toolbox.
  var toolboxText = document.getElementById("toolbox").outerHTML;
  toolboxText = toolboxText.replace(/{(\w+)}/g, function(m, p1) {
    return MSG[p1];
  });
  var toolboxXml = Blockly.Xml.textToDom(toolboxText);

  var scale = 1 + (1 - Game.LEVEL / Game.MAX_LEVEL) / 3;
  Game.workspace = Blockly.inject("blockly", {
    grid: {
      spacing: 25,
      length: 3,
      colour: "#ccc",
      snap: true
    },
    media: "../../../static/js/blockly/media/",
    toolbox: toolboxXml,
    trashcan: true,
    zoom: {
      startScale: scale
    },
    scrollbars: true
  });
};

/**
 * Initialize toolbox.
 * @param {Object} game. Current game type.
 */
Game.initToolbox = function(game) {
  var toolbox = document.getElementById("toolbox");
  var block = null;
  var blocks = [];

  // Block type needed.
  blocks = game.blocks[Game.LEVEL - 1];

  // Create toolbox xml.
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
 * Go to the index page.
 */
Game.indexPage = function() {
  window.location = BlocklyGames.IS_HTML ? "index.html" : "./";
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
  // Strip out serial numbers.
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
 * Determine if this event is unwanted.
 * @param {!Event} e Mouse or touch event.
 * @return {boolean} True if spam.
 */
Game.eventSpam = function(e) {
  // Touch screens can generate 'touchend' followed shortly thereafter by
  // 'click'.  For now, just look for this very specific combination.
  // Some devices have both mice and touch, but assume the two won't occur
  // within two seconds of each other.
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
  // Users double-click or double-tap accidentally.
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
