var Preloader = function () {
  this.images = {
    'empty1': {
      src: 'img/cards/empty1.png',
      image: null
    },
    'empty2': {
      src: 'img/cards/empty2.png',
      image: null
    },
    'empty3': {
      src: 'img/cards/empty3.png',
      image: null
    },
    'empty4': {
      src: 'img/cards/empty4.png',
      image: null
    },
    'treasure5': {
      src: 'img/cards/treasure5.png',
      image: null
    }
  };

  this.loadedCount = 0;

  var self = this;
  for (var key in this.images) {
    var imageObj = this.images[key];
    var image = new Image();
    image.src = imageObj.src;

    image.onload = function() {
      self.loadedCount++;
      if (self.loadedCount == Object.keys(self.images).length) {
        self.onload();
      }
    };

    this.images[key].image = image;
  }

  this.onload = null;
};



var CELL_SIZE = 60;
var ROWS_COUNT = 10;
var COLS_COUNT = 10;

var App = function (options) {
  this.defaults = {};
  this.options = extend(options, this.defaults);

  //init field
  this.field = [];
  for (var row = 0; row < ROWS_COUNT; row++) {
    this.field[row] = [];
    for (var col = 0; col < COLS_COUNT; col++) {
      this.field[row][col] = new Cell({
        row: row,
        col: col,
        status: CELL_STATUS.OPENED,
        type: (Math.random() < 0.08) ? CELL_TYPE.PROFIT : CELL_TYPE.EMPTY
      });
    }
  }

  this.players = [
    new Player({
      index: 1
    })
  ];

  var mainDiv = document.getElementById('content');
  this.drawField(mainDiv);
};

App.prototype.drawField = function(container) {
  var stage = new Kinetic.Stage({
    container: 'content',
    width: CELL_SIZE * COLS_COUNT,
    height: CELL_SIZE * ROWS_COUNT
  });
  var layer = new Kinetic.Layer();

  for (var row = 0; row < ROWS_COUNT; row++) {
    for (var col = 0; col < COLS_COUNT; col++) {
      this.field[row][col].render(layer, row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }

  for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
    var player = this.players[playerIndex];
    player.renderTokens(layer);
  }

  stage.add(layer);
};


var Cell = function (options) {
  this.defaults = {
    row: 0,
    col: 0,
    status: CELL_STATUS.CLOSED,
    type: CELL_TYPE.EMPTY
  };
  this.options = extend(options, this.defaults);
};


Cell.prototype.render = function(layer, offsetX, offsetY, size) {
  if (this.options.status === CELL_STATUS.OPENED) {
    if (this.options.type === CELL_TYPE.EMPTY) {
      var textureNum = Math.floor(Math.random() * 4) + 1;

      var emptyCellImg = new Kinetic.Image({
        x: offsetX,
        y: offsetY,
        width: size,
        height: size,
        image: preloader.images['empty' + textureNum].image,
        stroke: 'white',
        strokeWidth: 2
      });
      layer.add(emptyCellImg);
    }
    else if (this.options.type === CELL_TYPE.PROFIT) {
      var treasureImg = new Kinetic.Image({
        x: offsetX,
        y: offsetY,
        width: size,
        height: size,
        image: preloader.images['treasure5'].image,
        stroke: 'white',
        strokeWidth: 2
      });
      layer.add(treasureImg);
    }
  }
  
};


var CELL_STATUS = {
  CLOSED: 0,
  OPENED: 1
};

var CELL_TYPE = {
  EMPTY: 0,
  PROFIT: 99
};



var Player = function (options) {
  this.defaults = {
    index: 0
  };
  this.options = extend(options, this.defaults);

  this.tokens = [];
  var self = this;
  for (var i = 0; i < 3; i++) {
    var token = new Token({
      row: 1,
      col: 2 * i + 1,
      changeActiveStatusHandler: function (sender) {
        self.onChangeActiveToken(sender);
      }
    });
    this.tokens.push(token);
  }
  this.activeToken = null;
};

Player.prototype.renderTokens = function(context) {
  for (var i = 0; i < this.tokens.length; i++) {
    this.tokens[i].render(context);
  }
};

Player.prototype.onChangeActiveToken = function(sender) {
  if ((this.activeToken) && (sender != this.activeToken)) {
    this.activeToken.setActivated(false);
  }
  this.activeToken = sender;
};


var Token = function (options) {
  this.defaults = {
    row: 0,
    col: 0,
    status: TOKEN_STATUS.ALIVE,
    withGold: false,
    changeActiveStatusHandler: null
  };
  this.options = extend(options, this.defaults);
  this.shape = null;
  this.isActive = false;
};

Token.prototype.render = function(layer) {
  var x = this.options.col * CELL_SIZE;
  var y = this.options.row * CELL_SIZE;

  this.layer = layer;

  this.shape = new Kinetic.Shape({
    drawFunc: function(context) {
      var headR = CELL_SIZE / 8;
      var curX = x + CELL_SIZE / 2;
      var curY = y + CELL_SIZE / 4;

      context.beginPath();
      context.arc(curX, curY, headR, 0, 2*Math.PI);
      context.closePath();
      
      curX -= headR;
      curY += headR;

      context.rect(curX, curY, headR * 2, headR * 3);
      context.fillStrokeShape(this);
    },
    fill: '#CC0000',
    stroke: 'black',
    strokeWidth: 2
  });
  layer.add(this.shape);

  var self = this;
  this.shape.on('click', function () {
    self.setActivated(!self.isActive);
  });
};

Token.prototype.setActivated = function(value) {
  if (value === this.isActive) {
    return;
  }

  this.isActive = value;
  this.onChangeActiveStatus();
};

Token.prototype.onChangeActiveStatus = function() {
  var handler = this.options.changeActiveStatusHandler;
  if (handler) {
    handler(this);
  }

  if (this.isActive) {
    this.shape.setStroke('blue');
  }
  else {
    this.shape.setStroke('black');
  }
  this.layer.draw();
};



var TOKEN_STATUS = {
  DEAD: 0,
  ALIVE: 1
};

//Utils 

var extend = function() {
  var mixins = arguments;
  var retobj = {};

  for (var key in mixins) {
    if (mixins.hasOwnProperty(key)) {
      retobj = customExtend(mixins[key], retobj);
    }
  }
  return retobj;
};

var customExtend = function (/*obj_1, [obj_2], [obj_N]*/) {
  if (arguments.length < 1 || typeof arguments[0] !== 'object') {
      return false;
  }

  if (arguments.length < 2) return arguments[0];
  var target = arguments[0];

  // convert arguments to array and cut off target object
  var args = Array.prototype.slice.call(arguments, 1);

  var key, val, src, clone;

  args.forEach(function (obj) {
      if (typeof obj !== 'object') return;

      for (var key in obj) {
          if (obj[key] !== void 0) {
              src = target[key];
              val = obj[key];

              if (val === target) continue;

              if (typeof val !== 'object' || val === null || val.tagName) {
                  target[key] = val;
                  continue;
              }

              if (typeof src !== 'object') {
                  clone = (Array.isArray(val)) ? [] : {};
                  target[key] = customExtend(clone, val);
                  continue;
              }

              if (Array.isArray(val)) {
                  clone = (Array.isArray(src)) ? src : [];
              } else {
                  clone = (!Array.isArray(src)) ? src : {};
              }

              target[key] = customExtend(clone, val);
          }
      }
  });

  return target;
};