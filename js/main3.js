var Preloader = Backbone.Model.extend({
  constructor: function () {
    this.images = {
      'background': {
        src: 'img/background.jpg'
      },
      'closed': {
        src: 'img/cards/closed.png'
      },
      'DANGER_HOLD_2_1': {
        src: 'img/cards/1.jpg'
      },
      'ROOM_1': {
        src: 'img/cards/2.jpg'
      },
      'BATTARIES_2_1': {
        src: 'img/cards/3.jpg'
      },
      'GUN_1': {
        src: 'img/cards/4.jpg'
      },
      'DANGER_HOLD_1_1': {
        src: 'img/cards/5.jpg'
      },
      'STRUCTURE_1': {
        src: 'img/cards/6.jpg'
      },
      'HOLD_2_1': {
        src: 'img/cards/7.jpg'
      },
      'GUN_2': {
        src: 'img/cards/8.jpg'
      },
      'SHIELDS_1': {
        src: 'img/cards/9.jpg'
      },
      'ENGINE_1': {
        src: 'img/cards/10.jpg'
      },
      'HOLD_3_1': {
        src: 'img/cards/11.jpg'
      },
      'BATTARIES_3_1': {
        src: 'img/cards/12.jpg'
      },
      'STRUCTURE_2': {
        src: 'img/cards/13.jpg'
      },
      'ENGINE_2': {
        src: 'img/cards/14.jpg'
      },
      'STRUCTURE_3': {
        src: 'img/cards/15.jpg'
      },
      'CABIN_1': {
        src: 'img/cards/16.jpg'
      },
      'CABIN_2': {
        src: 'img/cards/17.jpg'
      },
      'CABIN_3': {
        src: 'img/cards/18.jpg'
      },
      'CABIN_4': {
        src: 'img/cards/19.jpg'
      },
      'CABIN_5': {
        src: 'img/cards/20.jpg'
      },
      'STRUCTURE_4': {
        src: 'img/cards/22.jpg'
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

var CELL_SIZE = 45;
var ROWS_COUNT = 5;
var COLS_COUNT = 5;
var PLAYER_FIELD_HEIGHT = 250;
var PLAYER_FIELD_WIDTH = 400;
var FIELD_WIDTH = 1023;
var FIELD_HEIGHT = 768;

var App = Backbone.Model.extend({
  constructor: function () {
    this.players = [];
    for (var i = 0; i < 4; i++) {
      this.players.push(new Player({
        number: i
      }));
    }

    this.modules = [];
    // this.modules.push();

    var modulesOptions = [
      {
        imageName: 'DANGER_HOLD_2_1',
        leftAdapter: ADAPTER_TYPES.NONE,
        rightAdapter: ADAPTER_TYPES.NONE,
        topAdapter: ADAPTER_TYPES.SINGLE,
        bottomAdapter: ADAPTER_TYPES.NONE,
        type: MODULE_TYPES.DANGER_HOLD_2
      },
      {
        imageName: 'ROOM_1',
        leftAdapter: ADAPTER_TYPES.SINGLE,
        rightAdapter: ADAPTER_TYPES.SINGLE,
        topAdapter: ADAPTER_TYPES.DOUBLE,
        bottomAdapter: ADAPTER_TYPES.DOUBLE,
        type: MODULE_TYPES.ROOM
      },
      {
        imageName: 'BATTARIES_2_1',
        leftAdapter: ADAPTER_TYPES.UNIVERSAL,
        rightAdapter: ADAPTER_TYPES.UNIVERSAL,
        topAdapter: ADAPTER_TYPES.NONE,
        bottomAdapter: ADAPTER_TYPES.NONE,
        type: MODULE_TYPES.BATTARIES_2
      },
      {
        imageName: 'GUN_1',
        leftAdapter: ADAPTER_TYPES.UNIVERSAL,
        rightAdapter: ADAPTER_TYPES.NONE,
        topAdapter: ADAPTER_TYPES.NONE,
        bottomAdapter: ADAPTER_TYPES.SINGLE,
        type: MODULE_TYPES.DOUBLE_GUN
      },
      {
        imageName: 'DANGER_HOLD_1_1',
        leftAdapter: ADAPTER_TYPES.UNIVERSAL,
        rightAdapter: ADAPTER_TYPES.NONE,
        topAdapter: ADAPTER_TYPES.UNIVERSAL,
        bottomAdapter: ADAPTER_TYPES.NONE,
        type: MODULE_TYPES.DANGER_HOLD_1
      },
      {
        imageName: 'HOLD_2_1',
        leftAdapter: ADAPTER_TYPES.UNIVERSAL,
        rightAdapter: ADAPTER_TYPES.SINGLE,
        topAdapter: ADAPTER_TYPES.NONE,
        bottomAdapter: ADAPTER_TYPES.DOUBLE,
        type: MODULE_TYPES.HOLD_2
      },
      {
        imageName: 'GUN_2',
        leftAdapter: ADAPTER_TYPES.DOUBLE,
        rightAdapter: ADAPTER_TYPES.NONE,
        topAdapter: ADAPTER_TYPES.NONE,
        bottomAdapter: ADAPTER_TYPES.NONE,
        type: MODULE_TYPES.GUN
      },
      {
        imageName: 'SHIELDS_1',
        leftAdapter: ADAPTER_TYPES.NONE,
        rightAdapter: ADAPTER_TYPES.UNIVERSAL,
        topAdapter: ADAPTER_TYPES.NONE,
        bottomAdapter: ADAPTER_TYPES.DOUBLE,
        type: MODULE_TYPES.SHIELDS
      },
      {
        imageName: 'ENGINE_1',
        leftAdapter: ADAPTER_TYPES.NONE,
        rightAdapter: ADAPTER_TYPES.NONE,
        topAdapter: ADAPTER_TYPES.SINGLE,
        bottomAdapter: ADAPTER_TYPES.NONE,
        type: MODULE_TYPES.ENGINE
      },
      {
        imageName: 'HOLD_3_1',
        leftAdapter: ADAPTER_TYPES.NONE,
        rightAdapter: ADAPTER_TYPES.NONE,
        topAdapter: ADAPTER_TYPES.SINGLE,
        bottomAdapter: ADAPTER_TYPES.DOUBLE,
        type: MODULE_TYPES.HOLD_3
      },
      {
        imageName: 'BATTARIES_3_1',
        leftAdapter: ADAPTER_TYPES.NONE,
        rightAdapter: ADAPTER_TYPES.NONE,
        topAdapter: ADAPTER_TYPES.SINGLE,
        bottomAdapter: ADAPTER_TYPES.DOUBLE,
        type: MODULE_TYPES.BATTARIES_3
      },
      {
        imageName: 'STRUCTURE_2',
        leftAdapter: ADAPTER_TYPES.DOUBLE,
        rightAdapter: ADAPTER_TYPES.UNIVERSAL,
        topAdapter: ADAPTER_TYPES.NONE,
        bottomAdapter: ADAPTER_TYPES.UNIVERSAL,
        type: MODULE_TYPES.STRUCTURE
      },
      {
        imageName: 'ENGINE_2',
        leftAdapter: ADAPTER_TYPES.DOUBLE,
        rightAdapter: ADAPTER_TYPES.DOUBLE,
        topAdapter: ADAPTER_TYPES.DOUBLE,
        bottomAdapter: ADAPTER_TYPES.NONE,
        type: MODULE_TYPES.DOUBLE_ENGINE
      },
      {
        imageName: 'STRUCTURE_3',
        leftAdapter: ADAPTER_TYPES.NONE,
        rightAdapter: ADAPTER_TYPES.UNIVERSAL,
        topAdapter: ADAPTER_TYPES.NONE,
        bottomAdapter: ADAPTER_TYPES.SINGLE,
        type: MODULE_TYPES.STRUCTURE
      }
    ];

    for (var i = 0; i < modulesOptions.length; i++) {
      for (var n = 0; n < 5; n++) {
        this.modules.push(new ModuleCard(modulesOptions[i]));
      }
    }

    var mainDiv = document.getElementById('content');
    this.drawField(mainDiv);

    Backbone.Model.apply(this, arguments);
  },
  drawField: function(container) {
    var stage = new Kinetic.Stage({
      container: 'content',
      width: FIELD_WIDTH,
      height: FIELD_HEIGHT
    });
    var layer = new Kinetic.Layer();

    layer.add(new Kinetic.Image({
      x: 0,
      y: 0,
      width: FIELD_WIDTH,
      height: FIELD_HEIGHT,
      image: preloader.images['background'].image
    }));

    stage.add(layer);

    this.cardsField = new CardsField({
      closedCards: this.modules
    });
    this.cardsField.render(layer, 340, 300, 400, 200);

    for (var i = 0; i < this.players.length; i++) {
      var newLayer = new Kinetic.Layer();
      stage.add(newLayer);

      switch (i) {
        case 0:
          newLayer.setOffsetX(-1 * ((FIELD_WIDTH - PLAYER_FIELD_WIDTH) / 2));
          newLayer.setOffsetY(-1 * (FIELD_HEIGHT - PLAYER_FIELD_HEIGHT));
          break;
        case 1:
          newLayer.setRotation(Math.PI);
          newLayer.setOffsetX(FIELD_WIDTH - (FIELD_WIDTH - PLAYER_FIELD_WIDTH) / 2);
          newLayer.setOffsetY(PLAYER_FIELD_HEIGHT);
          break;
        case 2:
          newLayer.setRotation(Math.PI / 2);
          newLayer.setOffsetX(-1 * ((FIELD_HEIGHT - PLAYER_FIELD_WIDTH) / 2));
          newLayer.setOffsetY(PLAYER_FIELD_HEIGHT);
          break;
        case 3:
          newLayer.setRotation(- Math.PI / 2);
          newLayer.setOffsetX(((FIELD_HEIGHT - PLAYER_FIELD_WIDTH) / 2 + PLAYER_FIELD_WIDTH));
          newLayer.setOffsetY(-1 * (FIELD_WIDTH - PLAYER_FIELD_HEIGHT));
          break;
      }

      newLayer.add(new Kinetic.Rect({
        x: 0,
        y: 0,
        width: PLAYER_FIELD_WIDTH,
        height: PLAYER_FIELD_HEIGHT,
        opacity: 0.3,
        fill: '808080'
      }));

      this.players[i].set('layer', newLayer);
      this.players[i].renderField();

      var self = this;
      this.players[i].on('requestNewModuleCard', function (args) {
        self.onRequestNewModuleCard(args.sender);
      });

      
    }

    layer.draw();
  },

  onRequestNewModuleCard: function (player) {
    if (this.modules.length > 0) {
      var cardNum = Math.floor(Math.random() * this.modules.length);
      this.moduleSelect(this.modules[cardNum], player);

      this.cardsField.trigger('cardSelected', { sender: this, player: player });

      delete this.modules[cardNum];
      this.modules.splice(cardNum, 1);
    }
  },

  moduleSelect: function (module, player) {
    player.set('activeModule', module);
  }
});


var Player = Backbone.Model.extend({
  
  defaults: {
    number: 0,
    layer: null,
    activeModule: null
  },

  constructor: function () {
    Backbone.Model.apply(this, arguments);

    var fieldMask = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    ];

    this.field = [];
    for (var row = 0; row < ROWS_COUNT; row++) {
      this.field[row] = [];
      for (var col = 0; col < COLS_COUNT; col++) {
        var moduleCard = null;
        if ((col === 2) && (row === 2)) {
          
          var imageName = null;
          switch (this.get('number')) {
            case 0:
              imageName = 'CABIN_4';
              break;
            case 1:
              imageName = 'CABIN_3';
              break;
            case 2:
              imageName = 'CABIN_1';
              break;
            case 3:
              imageName = 'CABIN_2';
              break;
          }

          moduleCard = new ModuleCard({
            imageName: imageName,
            leftAdapter: ADAPTER_TYPES.UNIVERSAL,
            rightAdapter: ADAPTER_TYPES.UNIVERSAL,
            topAdapter: ADAPTER_TYPES.UNIVERSAL,
            bottomAdapter: ADAPTER_TYPES.UNIVERSAL,
            type: MODULE_TYPES.CABIN
          });
        }

        var cell = new Cell({
          row: row,
          col: col,
          type: fieldMask[row][col],
          moduleCard: moduleCard
        });

        
        this.field[row][col] = cell;
      }
    }

    this.on('change:activeModule', this.onChangeActiveModule);
  },

  renderField: function () {
    var layer = this.get('layer');
    var offsetX = (PLAYER_FIELD_WIDTH - COLS_COUNT * CELL_SIZE) / 2;
    var offsetY = (PLAYER_FIELD_HEIGHT - ROWS_COUNT * CELL_SIZE) / 2;

    for (var row = 0; row < ROWS_COUNT; row++) {
      for (var col = 0; col < COLS_COUNT; col++) {
        var cell = this.field[row][col];
        cell.render(layer, offsetX + col * CELL_SIZE, offsetY + row * CELL_SIZE, CELL_SIZE);

        var self = this;
        cell.on("cellClicked", function (args) {
          self.onCellSelected(args.sender);
        });
      }
    }

    var newCardButton = new Kinetic.Circle({
      x: PLAYER_FIELD_WIDTH - CELL_SIZE / 2 - 5,
      y: CELL_SIZE / 2 + 5,
      radius: CELL_SIZE / 2,
      fill: 'green',
      stroke: '00FF00',
      strokeWidth: 3
    });
    layer.add(newCardButton);

    var self = this;
    newCardButton.on('click touchstart', function () {
      self.trigger('requestNewModuleCard', { sender: self });
    });

    this.activeModuleGroup = new Kinetic.Group();
    this.renderActiveCard();
    layer.add(this.activeModuleGroup);
  },

  renderActiveCard: function () {
    this.activeModuleGroup.removeChildren();

    var x = PLAYER_FIELD_WIDTH - CELL_SIZE - 5;
    var y = 60;

    if (!this.get('activeModule')) {
      this.get('layer').add(new Kinetic.Rect({
        x: x,
        y: y,
        width: CELL_SIZE,
        height: CELL_SIZE,
        fill: '3399FF',
        stroke: '005CB8',
        strokeWidth: 1
      }));
    }
    else {
      this.get('activeModule').render(this.get('layer'), x, y, CELL_SIZE);
    }
    this.get('layer').draw();
  },

  onChangeActiveModule: function () {
    this.renderActiveCard();
  },

  onCellSelected: function (cell) {
    if (this.get('activeModule')) {
      var moduleCard = this.get('activeModule');

      var isCanPlace = true;
      var isOneAdapterConnected = false;

      var row = cell.get('row');
      var col = cell.get('col');


      if (col > 0) {
        var checkCell = this.field[row][col - 1];
        if (checkCell.get('moduleCard')) {
          isCanPlace &= moduleCard.checkCompatibility(checkCell.get('moduleCard'), DIRECTIONS.RIGHT);
          isOneAdapterConnected |= (moduleCard.get('leftAdapter') !== ADAPTER_TYPES.NONE);
        }
      }

      if (col < COLS_COUNT - 1) {
        var checkCell = this.field[row][col + 1];
        if (checkCell.get('moduleCard')) {
          isCanPlace &= moduleCard.checkCompatibility(checkCell.get('moduleCard'), DIRECTIONS.LEFT);
          isOneAdapterConnected |= (moduleCard.get('rightAdapter') !== ADAPTER_TYPES.NONE);
        }
      }

      if (row > 0) {
        var checkCell = this.field[row - 1][col];
        if (checkCell.get('moduleCard')) {
          isCanPlace &= moduleCard.checkCompatibility(checkCell.get('moduleCard'), DIRECTIONS.BOTTOM);
          isOneAdapterConnected |= (moduleCard.get('topAdapter') !== ADAPTER_TYPES.NONE);
        }
      }

      if (row < ROWS_COUNT - 1) {
        var checkCell = this.field[row + 1][col];
        if (checkCell.get('moduleCard')) {
          isCanPlace &= moduleCard.checkCompatibility(checkCell.get('moduleCard'), DIRECTIONS.TOP);
          isOneAdapterConnected |= (moduleCard.get('bottomAdapter') !== ADAPTER_TYPES.NONE);
        }
      }

      if (isCanPlace && isOneAdapterConnected) {
        cell.set('moduleCard', moduleCard);
        this.set('activeModule', null);
      }
      else {
        cell.drawError();
      }
    }
  }
});


var CELL_STATUS = {
  CLOSED: 0,
  OPENED: 1
};

var CELL_TYPE = {
  NONE: 0,
  EMPTY: 1,
  CABIN: 2
};


var Cell = Backbone.Model.extend({

  defaults: {
    row: 0,
    col: 0,
    type: CELL_TYPE.NONE,
    moduleCard: null
  },

  constructor: function () {
    Backbone.Model.apply(this, arguments);

    this.on('change:moduleCard', this.onChangeModuleCard);
    this.layer = null;
  },

  render: function(layer, offsetX, offsetY, size) {
    this.layer = layer;
    this.x = offsetX;
    this.y = offsetY;
    this.size = size;

    var group = new Kinetic.Group();

    var mainRect = null;
    if (this.get('type') === CELL_TYPE.NONE) {
      mainRect = new Kinetic.Rect({
        x: offsetX,
        y: offsetY,
        width: size,
        height: size,
      });
      group.add(mainRect);
    }
    else if (this.get('type') === CELL_TYPE.EMPTY) {
      mainRect = new Kinetic.Rect({
        x: offsetX,
        y: offsetY,
        width: size,
        height: size,
        fill: '9e9c99',
        stroke: 'white',
        strokeWidth: 1,
        opacity: 0.4
      });
      group.add(mainRect);
    }

    layer.add(group);

    this.renderModuleCard();

    var self = this;
    group.on('click touchstart', function () {
      self.trigger("cellClicked", { sender: self });
    });
  },

  renderModuleCard: function () {
    if (this.get('moduleCard')) {
      this.get('moduleCard').render(this.layer, this.x, this.y, this.size);
      this.layer.draw();
    }
  },

  onChangeModuleCard: function () {
    this.renderModuleCard();
  },

  drawError: function () {
    var mainRect = new Kinetic.Rect({
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size,
      fill: 'red',
      opacity: 0
    });
    this.layer.add(mainRect);

    var animTime = 800;
    var opacity = 0.5;
    var stepOpacity = 0.05;

    var anim = new Kinetic.Animation(function(frame) {
      var time = frame.time;

      mainRect.setOpacity(mainRect.getOpacity() + stepOpacity);

      if ((frame.time > animTime / 2) && (stepOpacity > 0)) {
        stepOpacity = -stepOpacity;
      }
      if (frame.time > animTime) {
        mainRect.setOpacity(0);
        mainRect.remove();
        this.stop();
      }
    }, this.layer);

    anim.start();
  }

});


MODULE_TYPES = {
  CABIN: 0,
  ROOM: 1,
  ENGINE: 2,
  GUN: 3,
  DOUBLE_GUN: 4,
  DOUBLE_ENGINE: 5,
  BATTARIES_2: 6,
  BATTARIES_3: 7,
  SHIELDS: 8,
  HOLD_2: 9,
  HOLD_3: 10,
  DANGER_HOLD_2: 11,
  DANGER_HOLD_3: 12,
  STRUCTURE: 13
};

ADAPTER_TYPES = {
  NONE: 0,
  SINGLE: 1,
  DOUBLE: 2,
  UNIVERSAL: 3
};

DIRECTIONS = {
  LEFT: 0,
  RIGHT: 1,
  TOP: 2,
  BOTTOM: 3
};

var ModuleCard = Backbone.Model.extend({

  defaults: {
    type: MODULE_TYPES.NONE,
    leftAdapter: ADAPTER_TYPES.NONE,
    rightAdapter: ADAPTER_TYPES.NONE,
    topAdapter: ADAPTER_TYPES.NONE,
    bottomAdapter: ADAPTER_TYPES.NONE,
    imageName: null
  },

  constructor: function () {
    Backbone.Model.apply(this, arguments);
  },

  render: function(layer, offsetX, offsetY, size) {
    var group = new Kinetic.Group();

    var mainRect = new Kinetic.Rect({
      x: offsetX,
      y: offsetY,
      width: size,
      height: size,
      fill: '7c7ea6',
      stroke: 'white',
      strokeWidth: 1
    });
    group.add(mainRect);

    var image = null;
    if (this.get('imageName')) {
      image = preloader.images[this.get('imageName')].image;
    }

    var img = new Kinetic.Image({
      x: offsetX + 1,
      y: offsetY + 1,
      width: size - 2,
      height: size - 2,
      image: image
    });
    group.add(img);

    layer.add(group);

    var self = this;
    group.on('click touchstart', function () {
      self.trigger("moduleClicked", { sender: self });
    });
  },

  checkCompatibility: function (moduleCard, direction) {
    var thisAdapterType = null;
    var checkedAdapterType = null;
    switch (direction) {
      case DIRECTIONS.LEFT:
        thisAdapterType = this.get('rightAdapter');
        checkedAdapterType = moduleCard.get('leftAdapter');
        break;
      case DIRECTIONS.RIGHT:
        thisAdapterType = this.get('leftAdapter');
        checkedAdapterType = moduleCard.get('rightAdapter');
        break;
      case DIRECTIONS.TOP:
        thisAdapterType = this.get('bottomAdapter');
        checkedAdapterType = moduleCard.get('topAdapter');
        break;
      case DIRECTIONS.BOTTOM:
        thisAdapterType = this.get('topAdapter');
        checkedAdapterType = moduleCard.get('bottomAdapter');
        break;
    }

    var isValid = false;
    if (thisAdapterType === ADAPTER_TYPES.UNIVERSAL) {
      isValid = (checkedAdapterType !== ADAPTER_TYPES.NONE);
    }
    else if (checkedAdapterType === ADAPTER_TYPES.UNIVERSAL) {
      isValid = (thisAdapterType !== ADAPTER_TYPES.NONE);
    }
    else if (checkedAdapterType === thisAdapterType) {
      isValid = true;
    }
    
    return isValid;
  }
});


var CardsField = Backbone.Model.extend({

  defaults: {
    closedCards: [],
    openedCards: []
  },

  constructor: function () {
    Backbone.Model.apply(this, arguments);

    var self = this;
    this.on('cardSelected', function (args) {
      self.onCardSelected(args);
    });
  },

  render: function (layer, offsetX, offsetY, width, height) {
    this.layer = layer;

    var cards = this.get('closedCards');
    this.cardsRects = [];
    for (var i = 0; i < cards.length; i++) {
      var x = Math.floor(Math.random() * (width - CELL_SIZE * 1.5));
      var y = Math.floor(Math.random() * (height - CELL_SIZE * 1.5));
      var rotateAngle = Math.floor(Math.random() * Math.PI);
      var cardRect = new Kinetic.Image({
        x: offsetX + x,
        y: offsetY + y,
        width: CELL_SIZE,
        height: CELL_SIZE,
        image: preloader.images['closed'].image,
        stroke: 'white',
        strokeWidth: 4,
        rotation: rotateAngle
      });

      this.cardsRects.push(cardRect);
      layer.add(cardRect);
    }
  },

  onCardSelected: function (args) {
    var cardNum = this.cardsRects.length-1;
    var cardRect = this.cardsRects[cardNum];
    delete this.cardsRects[cardNum];
    this.cardsRects.splice(cardNum, 1);

    var playerNum = args.player.get('number');

    var animTime = 800;
    var coordDelta = 100;
    var scale = 2;
    var rotationAngle = Math.PI;

    var anim = new Kinetic.Animation(function(frame) {
      var time = frame.time;
      var timeDiff = frame.timeDiff;
      
      // var opacityStep = (time / animTime) * 2;
      var opacityVal = (time / animTime);
      var coordStep = (timeDiff / animTime) * coordDelta;
      var scaleVal = 1 + (time / animTime);
      var rotationVal = (time / animTime) * rotationAngle;

      if (opacityVal > 0) {
        cardRect.setOpacity(1 - opacityVal);
      }
      cardRect.setScale(scaleVal);
      cardRect.setRotation(rotationVal);

      switch (playerNum) {
        case 0:
          cardRect.setY(cardRect.getY() + coordStep);
          break;
        case 1:
          cardRect.setY(cardRect.getY() - coordStep);
          break;
        case 2:
          cardRect.setX(cardRect.getX() - coordStep);
          break;
        case 3:
          cardRect.setX(cardRect.getX() + coordStep);
          break;
      }

      if (frame.time > animTime) {
        cardRect.remove();
        this.stop();
      }
    }, this.layer);

    anim.start();
  }
});
