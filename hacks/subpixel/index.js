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
    return "rgb(" + Math.round(Math.random()*255) + ", " + Math.round(Math.random()*255) + ", " + Math.round(Math.random()*255) + ")";
  }

  function drawSpirograph(ctx, R, r, O) {
    var x1 = R-O;
    var y1 = 0;
    var i = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.strokeStyle = randomColor();

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

      var R = size/4;
      var r = Math.random() * size/4;
      var O = Math.random() * size/4;

      ctx.translate(size/2, size/2);
      drawSpirograph(ctx, R, r, O);
      tileImages.push(c);
    }

    return tileImages;
  }

  var Tile = function() {
    // properties
  }

  Tile.make = function(n) {
    var tiles = []
    for (var i = 0; i < n; i++) {
      tiles.push(new Tile());
    }
    return tiles;
  }

  var Board = function(width, height) {
    this.width = width;
    this.height = height;
    this.centerX = Math.floor(this.width/2);
    this.centerY = Math.floor(this.height/2);
    this.grid = new Int8Array(this.width*this.height);
    this.tiles = Tile.make(10);

    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        this.setTile(x, y, this.randomTile());
      }
    }
  }

  Board.prototype.randomTile = function() {
    return Math.floor(Math.random()*this.tiles.length-1)+1;
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

  Board.prototype.neighbors = function(x, y, callback) {
    for (var x2 = x-1; x2 <= x+1; x2++) {
      for (var y2 = y-1; y2 <= y+1; y2++) {
        if (x2 >= 0 && x2 < this.width && y2 >= 0 && y2 < this.height) {
          callback(x2, y2);
        }
      }
    }
  }

  Board.prototype.step = function() {
    var changes = [];

    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var tile = this.tile(x, y);

        this.neighbors(x, y, function(x2, y2) {
          if (Math.random() > 0.5 && this.tile(x2, y2) == tile-1) {
            changes.push([x2, y2, tile]);
          }
        }.bind(this));

        if (Math.random() > 0.9) {
          changes.push([x, y, this.randomTile()]);
        }
      }
    }

    changes.forEach(function(change) {
      this.setTile(change[0], change[1], change[2]);
    }.bind(this));

    return changes;
  }

  var Game = function(canvas, width) {
    var width = width;
    var height = Math.floor(canvas.height/canvas.width * width);
    this.board = new Board(width, height);

    this.canvas = canvas;
    this.bufferCanvas = this.canvas.cloneNode();
    this.ctx = this.canvas.getContext('2d');
    this.outputCtx = this.canvas.getContext('2d');

    this.tileSize = Math.ceil(canvas.width/this.board.width);
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

  var changes = null;
  Game.prototype.update = function(time) {
    if (time === undefined) time = 0;
    var dt = time - lastTime;
    count += dt;

    if (dt !== 0) {
      this.updateFPS(1000/dt);
    }

    requestAnimationFrame(this.update.bind(this));

    if (count > 100) {
      changes = this.board.step();
      count = 0;
    } else {
      changes = [];
    }

    this.render(changes)

    lastTime = time;
  }

  Game.prototype.render = function(changes) {
    var ctx = this.ctx;

    /*ctx.fillStyle = "#89cff0";
    this.board.eachValidPlace(function(x, y) {
      var cx = Math.floor(x/this.board.width * this.canvas.width);
      var cy = Math.floor(y/this.board.height * this.canvas.height);

      ctx.fillRect(cx, cy, this.tileSize, this.tileSize);
    }.bind(this));*/

    if (changes !== null) {
      changes.forEach(function(change) {
        var cx = Math.floor(change[0]/this.board.width * this.canvas.width);
        var cy = Math.floor(change[1]/this.board.height * this.canvas.height);
        ctx.clearRect(cx, cy, this.tileSize, this.tileSize);
        ctx.drawImage(this.tileImages[change[2]], 0, 0, this.tileSize, this.tileSize, cx, cy, this.tileSize, this.tileSize);
      }.bind(this));
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (var x = 0; x < this.board.width; x++) {
        for (var y = 0; y < this.board.height; y++) {
          // Convert to canvas coordinates
          var cx = Math.floor(x/this.board.width * this.canvas.width);
          var cy = Math.floor(y/this.board.height * this.canvas.height);

          var tile = this.board.tile(x, y);

          if (tile > 0) {
            ctx.drawImage(this.tileImages[tile], 0, 0, this.tileSize, this.tileSize, cx, cy, this.tileSize, this.tileSize);
          }
        }
      }
    }
  }

  var canvas = $('canvas')[0];

  function resize() {
    canvas.width = $('canvas').width()/36;
    canvas.height = $('canvas').height()/36;
  }

  $(window).on('resize', resize);
  resize();

  var game = new Game(canvas, 50);
  game.update();
})();
