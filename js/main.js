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
    'treasure': {
      src: 'img/cards/treasure.png',
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
        type: (Math.random() < 0.1) ? CELL_TYPE.PROFIT : CELL_TYPE.EMPTY
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
  var canvas = document.createElement('canvas');
  canvas.width = CELL_SIZE * COLS_COUNT;
  canvas.height = CELL_SIZE * ROWS_COUNT;

  var context = canvas.getContext('2d');

  for (var row = 0; row < ROWS_COUNT; row++) {
    for (var col = 0; col < COLS_COUNT; col++) {
      this.field[row][col].render(context, row * CELL_SIZE, col * CELL_SIZE, CELL_SIZE);
    }
  }

  for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
    var player = this.players[playerIndex];
    player.renderTokens(context);
  }

  container.appendChild(canvas);
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


Cell.prototype.render = function(context, offsetX, offsetY, size) {
  if (this.options.status === CELL_STATUS.OPENED) {
    if (this.options.type === CELL_TYPE.EMPTY || CELL_TYPE.PROFIT) {
      //TODO: cache this
      var textureNum = Math.floor(Math.random() * 2) + 1;

      var img = preloader.images['empty' + textureNum].image;
      // document.getElementById('test').appendChild(img);

      var border = 1;
      context.drawImage(img, offsetX + border , offsetY + border, size - border * 2, size - border * 2);

      if (this.options.type === CELL_TYPE.PROFIT) {

        var imgProfit = new Image();
        imgProfit.src = 'img/cards/treasure.png';
        imgProfit.onload = function() {
          console.log(1);
          context.drawImage(imgProfit, offsetX + 10 , offsetY + 10, size - 20, size - 20);
        };
      }
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
  for (var i = 0; i < 3; i++) {
    var token = new Token({
      row: 1,
      col: 2 * i + 1
    });
    this.tokens.push(token);
  }  
};

Player.prototype.renderTokens = function(context) {
  for (var i = 0; i < this.tokens.length; i++) {
    this.tokens[i].render(context);
  }
};

var Token = function (options) {
  this.defaults = {
    row: 0,
    col: 0,
    status: TOKEN_STATUS.ALIVE
  };
  this.options = extend(options, this.defaults);
};

Token.prototype.render = function(context) {
  var x = this.options.col * CELL_SIZE;
  var y = this.options.row * CELL_SIZE;

  context.fillStyle="#00FF00";
  context.fillRect(x + 10, y + 10, 20, 20);
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
