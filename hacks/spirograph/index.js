(function () {
  var lastTime = 0,
    vendors = ['ms', 'moz', 'webkit', 'o'],
    // Feature check for performance (high-resolution timers)
    hasPerformance = !!(window.performance && window.performance.now);

  for(var x = 0, max = vendors.length; x < max && !window.requestAnimationFrame; x += 1) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                  || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
       timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  // Add new wrapper for browsers that don't have performance
  if (!hasPerformance) {
    // Store reference to existing rAF and initial startTime
    var rAF = window.requestAnimationFrame,
      startTime = +new Date;

    // Override window rAF to include wrapped callback
    window.requestAnimationFrame = function (callback, element) {
      // Wrap the given callback to pass in performance timestamp
      var wrapped = function (timestamp) {
        // Get performance-style timestamp
        var performanceTimestamp = (timestamp < 1e12) ? timestamp : timestamp - startTime;

        return callback(performanceTimestamp);
      };

      // Call original rAF with wrapped callback
      AF(wrapped, element);
    }
  }
})();

(function() {
  "use strict";

  function randomColor() {
    return "rgb(" + Math.round(Math.random()*255) + ", " + Math.round(Math.random()*255) + ", " + Math.round(Math.random()*255) + ");";
  }

  function drawSpirograph(ctx, R, r, O) {
    var x1 = R-O;
    var y1 = 0;
    var i = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    do {
      if (i  > 1000) break;
      var x2 = (R+r)*Math.cos(i*Math.PI/72) -
               (r+O)*Math.cos(((R+r)/r)*(i*Math.PI/72))
      var y2 = (R+r)*Math.sin(i*Math.PI/72) -
               (r+O)*Math.sin(((R+r)/r)*(i*Math.PI/72))
      ctx.lineTo(x2,y2);
      x1 = x2;
      y1 = y2;
      i++;
    } while (x2 != R-O && y2 != 0 );
    ctx.stroke();
  }

  function genTileImages(tiles, size) {
    var tileImages = [];

    for (var i = 0; i < tiles.length; i++) {
      var c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      var ctx = c.getContext('2d');
      ctx.strokeStyle = randomColor();

      var R = size/4;
      var r = Math.random() * size/4;
      var O = Math.random() * size/4;

      ctx.translate(size/2, size/2);
      drawSpirograph(ctx, R, r, O);
      tileImages.push(c);
    }

    return tileImages;
  }

  var Tile = function(i) {
    // properties
    this.index = i;
    this.trigger = 'same-neighbor'
    this.effect = 'grow';
  }

  Tile.make = function(n) {
    var tiles = []
    for (var i = 0; i < n; i++) {
      tiles.push(new Tile(i));
    }
    return tiles;
  }

  Tile.prototype.resolve = function(board, x, y) {
    var triggered = false;

    board.neighbors(x, y, function(x2, y2) {
      if (board.tile(x2, y2) == this.index) {
        triggered = true;
      }
    }.bind(this));

    if (!triggered) return;

    if (this.effect == 'grow') {
      board.neighbors(x, y, function(x2, y2) {
        //board.queueTileChange(x2, y2, this.index);
      }.bind(this));
    }
  }

  var Board = function(width, height) {
    this.width = width;
    this.height = height;
    this.centerX = Math.floor(this.width/2);
    this.centerY = Math.floor(this.height/2);
    this.grid = new Int8Array(this.width*this.height);
    this.tiles = Tile.make(30);

    this.tileChanges = [];

    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        this.setTile(x, y, this.randomTile());
      }
    }
  }

  Board.prototype.randomTile = function() {
    return Math.floor(Math.random()*this.tiles.length);
  }

  // Check is a spot is empty and valid for placing a tile
  // on this turn
  Board.prototype.isValidPlace = function(x, y) {
    if (this.tile(x, y) !== 0) {
     return false; // Already occupied
    }

    var neighbor = false;

    for (var x2 = x-1; x2 <= x+1; x2++) {
      for (var y2 = y-1; y2 <= y+1; y2++) {
        if (this.tile(x2, y2) !== 0 && this.tile(x2, y2) !== undefined) {
          neighbor = true;
          break;
        }
      }
    }

    if (neighbor || (x == this.centerX && y == this.centerY)) {
      return true;
    }
  }

  // Returns an array of coordinates representing valid cells
  // for placing new tiles
  Board.prototype.eachValidPlace = function(callback) {
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if (this.isValidPlace(x, y)) {
          callback(x,y);
        }
      }
    }
  }

  Board.prototype.tile = function(x, y) {
    return this.grid[y*this.width + x];
  }

  Board.prototype.setTile = function(x, y, tile) {
    this.grid[y*this.width + x] = tile;
  }

  Board.prototype.queueTileChange = function(x, y, tile) {
    this.tileChanges.push([x, y, tile]);
  }

  Board.prototype.neighbors = function(x, y, callback) {
    for (var x2 = x-1; x2 <= x+1; x2++) {
      for (var y2 = y-1; y2 <= y+1; y2++) {
        if (x != x2 || y != y2) {
          callback(x2, y2);
        }
      }
    }
  }

  Board.prototype.step = function() {
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var tile = this.tile(x, y);

        if (tile == 0) { continue; }

        this.tiles[tile].resolve(this, x, y);
      }
    }

    this.tileChanges.forEach(function(change) {
      this.setTile(change[0], change[1], change[2]);
    }.bind(this));

    this.tileChanges = [];
  }

  var Game = function(canvas) {
    var width = 100;
    var height = Math.floor(canvas.height/canvas.width * width);
    this.board = new Board(width, height);

    this.canvas = canvas;
    this.bufferCanvas = this.canvas.cloneNode();
    this.ctx = this.bufferCanvas.getContext('2d');
    this.outputCtx = this.canvas.getContext('2d');

    this.tileSize = Math.floor(canvas.width/this.board.width);
    this.tileImages = genTileImages(this.board.tiles, this.tileSize);
    this.selectedTile = 0;

    this.hoverX = -1;
    this.hoverY = -1;

    $(canvas).on('mousewheel', function(ev) {
      if (ev.originalEvent.wheelDelta > 0) {
        this.selectedTile += 1;

        if (this.selectedTile >= this.tileImages.length) {
          this.selectedTile = 0;
        }
      } else {
        this.selectedTile -= 1;

        if (this.selectedTile < 1) {
          this.selectedTile = this.tileImages.length-1;
        }
      }
    }.bind(this));

    $(canvas).on('mousedown', function(ev) {
      if (this.board.isValidPlace(this.hoverX, this.hoverY)) {
        this.board.setTile(this.hoverX, this.hoverY, this.selectedTile);
      }
    }.bind(this));

    $(canvas).on('mousemove', function(ev) {
      var cx = ev.pageX - $(canvas).offset().left;
      var cy = ev.pageY - $(canvas).offset().top;

      var x = Math.floor(this.board.width * (cx / canvas.width));
      var y = Math.floor(this.board.height * (cy / canvas.height));

      this.hoverX = x;
      this.hoverY = y;
    }.bind(this));
  };

  var lastTime = 0;
  var count = 0;

  // We average the frame count over a few frames
  // to prevent statistical noise flickering
  var frameRates = [];
  Game.prototype.updateFPS = function(currentFPS) {
    if (frameRates.length > 100) {
      frameRates.shift()
    }
    frameRates.push(currentFPS);

    var total = 0;
    frameRates.forEach(function(fps) {
      total += fps;
    });

    $("#fps").text(Math.round(total/frameRates.length) + " FPS");
  }

  Game.prototype.update = function(time) {
    if (time === undefined) time = 0;
    var dt = time - lastTime;
    count += dt;

    if (dt !== 0) {
      this.updateFPS(1000/dt);
    }

    requestAnimationFrame(this.update.bind(this));

    if (count > 1000) {
      this.board.step();
      count = 0;
    }

    this.render()

    lastTime = time;
  }

  Game.prototype.render = function() {
    var ctx = this.ctx;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "#89cff0";
    this.board.eachValidPlace(function(x, y) {
      var cx = Math.floor(x/this.board.width * this.canvas.width);
      var cy = Math.floor(y/this.board.height * this.canvas.height);

      ctx.fillRect(cx, cy, this.tileSize, this.tileSize);
    }.bind(this));

    for (var x = 0; x < this.board.width; x++) {
      for (var y = 0; y < this.board.height; y++) {
        // Convert to canvas coordinates
        var cx = Math.floor(x/this.board.width * this.canvas.width);
        var cy = Math.floor(y/this.board.height * this.canvas.height);

        var tile = this.board.tile(x, y);

        if (this.hoverX == x && this.hoverY == y &&
            this.board.isValidPlace(this.hoverX, this.hoverY)) {
          tile = this.selectedTile;
        }

        if (tile > 0) {
          ctx.drawImage(this.tileImages[tile], 0, 0, this.tileSize, this.tileSize, cx, cy, this.tileSize, this.tileSize);
        }

        /*ctx.fillRect(
          Math.floor(x/this.width * this.canvas.width),
          Math.floor(y/this.height * this.canvas.height),
          Math.ceil(this.canvas.width/this.width),
          Math.ceil(this.canvas.height/this.height)
        );*/
      }
    }

    //ctx.fillStyle = "#F5AA44";
    //ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.outputCtx.drawImage(this.bufferCanvas, 0, 0);
  }

  var canvas = $('canvas')[0];

  function resize() {
    canvas.width = $('canvas').width();
    canvas.height = $('canvas').height();
  }

  $(window).on('resize', resize);
  resize();

  var game = new Game(canvas);
  game.render();
  //game.update();
})();
