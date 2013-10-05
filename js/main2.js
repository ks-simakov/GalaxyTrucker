var Preloader = Backbone.Model.extend({
  constructor: function () {
    console.log('test');
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

    Backbone.Model.apply(this, arguments);
  }
});

Preloader.prototype._init = function() {

};


var CELL_SIZE = 60;
var ROWS_COUNT = 10;
var COLS_COUNT = 10;



var App = Backbone.Model.extend({
  constructor: function () {
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

    Backbone.Model.apply(this, arguments);
  },
  drawField: function(container) {
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
  }
});


var CELL_STATUS = {
  CLOSED: 0,
  OPENED: 1
};

var CELL_TYPE = {
  EMPTY: 0,
  PROFIT: 99
};


var Cell = Backbone.Model.extend({

  defaults: {
    row: 0,
    col: 0,
    status: CELL_STATUS.CLOSED,
    type: CELL_TYPE.EMPTY
  },

  constructor: function () {
    Backbone.Model.apply(this, arguments);
  },

  render: function(layer, offsetX, offsetY, size) {
    if (this.get('status') === CELL_STATUS.OPENED) {
      if (this.get('type') === CELL_TYPE.EMPTY) {
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
      else if (this.get('type') === CELL_TYPE.PROFIT) {
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
  }
});


var Player = Backbone.Model.extend({

  defaults: {
    index: 0
  },

  constructor: function () {
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

    Backbone.Model.apply(this, arguments);
  },

  renderTokens: function(context) {
    for (var i = 0; i < this.tokens.length; i++) {
      this.tokens[i].render(context);
    }
  },

  onChangeActiveToken: function(sender) {
    if ((this.activeToken) && (sender != this.activeToken)) {
      this.activeToken.setActivated(false);
    }
    this.activeToken = sender;
  }
});


var TOKEN_STATUS = {
  DEAD: 0,
  ALIVE: 1
};


var Token = Backbone.Model.extend({

  defaults: {
    row: 0,
    col: 0,
    status: TOKEN_STATUS.ALIVE,
    withGold: false,
    changeActiveStatusHandler: null
  },

  constructor: function () {
    this.shape = null;
    this.isActive = false;
    Backbone.Model.apply(this, arguments);
  },

  render: function(layer) {
    var x = this.get('col') * CELL_SIZE;
    var y = this.get('row') * CELL_SIZE;

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
  },

  setActivated: function(value) {
    if (value === this.isActive) {
      return;
    }

    this.isActive = value;
    this.onChangeActiveStatus();
  },

  onChangeActiveStatus: function() {
    var handler = this.get('changeActiveStatusHandler');
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
  }
});



