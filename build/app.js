(function() {
  /**
   * Require the given path.
   *
   * @param {String} path
   * @return {Object} exports
   * @api public
   */
  function require(path, parent, orig) {
    var resolved = require.resolve(path);

    // lookup failed
    if (null == resolved) {
      orig = orig || path;
      parent = parent || 'root';
      var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
      err.path = orig;
      err.parent = parent;
      err.require = true;
      throw err;
    }

    var module = require.modules[resolved];

    // perform real require()
    // by invoking the module's
    // registered function
    if (!module._resolving && !module.exports) {
      var mod = {};
      mod.exports = {};
      mod.client = mod.component = true;
      module._resolving = true;
      module.call(this, mod.exports, require.relative(resolved), mod);
      delete module._resolving;
      module.exports = mod.exports;
    }

    return module.exports;
  }

  /**
   * Registered modules.
   */

  require.modules = {};

  /**
   * Registered aliases.
   */

  require.aliases = {};

  /**
   * Resolve `path`.
   *
   * Lookup:
   *
   *   - PATH/index.js
   *   - PATH.js
   *   - PATH
   *
   * @param {String} path
   * @return {String} path or null
   * @api private
   */

  require.resolve = function(path) {
    if (path.charAt(0) === '/') path = path.slice(1);

    var paths = [
      path,
      path + '.js',
      path + '.json',
      path + '/index.js',
      path + '/index.json'
    ];

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      if (require.modules.hasOwnProperty(path)) return path;
      if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
    }
  };

  /**
   * Normalize `path` relative to the current path.
   *
   * @param {String} curr
   * @param {String} path
   * @return {String}
   * @api private
   */

  require.normalize = function(curr, path) {
    var segs = [];

    if ('.' != path.charAt(0)) return path;

    curr = curr.split('/');
    path = path.split('/');

    for (var i = 0; i < path.length; ++i) {
      if ('..' == path[i]) {
        curr.pop();
      } else if ('.' != path[i] && '' != path[i]) {
        segs.push(path[i]);
      }
    }

    return curr.concat(segs).join('/');
  };

  /**
   * Register module at `path` with callback `definition`.
   *
   * @param {String} path
   * @param {Function} definition
   * @api private
   */

  require.register = function(path, definition) {
    require.modules[path] = definition;
  };

  /**
   * Alias a module definition.
   *
   * @param {String} from
   * @param {String} to
   * @api private
   */

  require.alias = function(from, to) {
    if (!require.modules.hasOwnProperty(from)) {
      throw new Error('Failed to alias "' + from + '", it does not exist');
    }
    require.aliases[to] = from;
  };

  /**
   * Return a require function relative to the `parent` path.
   *
   * @param {String} parent
   * @return {Function}
   * @api private
   */

  require.relative = function(parent) {
    var p = require.normalize(parent, '..');

    /**
     * lastIndexOf helper.
     */

    function lastIndexOf(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) return i;
      }
      return -1;
    }

    /**
     * The relative require() itself.
     */

    function localRequire(path) {
      var resolved = localRequire.resolve(path);
      return require(resolved, parent, path);
    }

    /**
     * Resolve relative to the parent.
     */

    localRequire.resolve = function(path) {
      var c = path.charAt(0);
      if ('/' == c) return path.slice(1);
      if ('.' == c) return require.normalize(p, path);

      // resolve deps by returning
      // the dep in the nearest "deps"
      // directory
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    };

    /**
     * Check if module is defined at `path`.
     */
    localRequire.exists = function(path) {
      return require.modules.hasOwnProperty(localRequire.resolve(path));
    };

    return localRequire;
  };

  // All our modules will see our own require.
  (function() {
    
    
    // app.coffee
    require.register('deadmonton/src/app.js', function(exports, require, module) {
    
      var Layout;
      
      Layout = require('./views/layout');
      
      module.exports = function() {
        return (new Layout()).render();
      };
      
    });

    
    // config.coffee
    require.register('deadmonton/src/config.js', function(exports, require, module) {
    
      module.exports = {
        'colors': {
          'Theft From Vehicle': [255, 237, 160],
          'Theft Of Vehicle': [254, 217, 118],
          'Theft Over $5000': [254, 217, 118],
          'Break and Enter': [253, 141, 60],
          'Robbery': [253, 141, 60],
          'Assault': [227, 26, 28],
          'Sexual Assaults': [227, 26, 28],
          'Homicide': [0, 0, 0]
        },
        'window': {
          'width': $(window).width(),
          'height': $(window).height()
        }
      };
      
    });

    
    // mediator.coffee
    require.register('deadmonton/src/modules/mediator.js', function(exports, require, module) {
    
      module.exports = _.extend({}, Backbone.Events);
      
    });

    
    // controls.eco
    require.register('deadmonton/src/templates/controls.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<span class="icon replay"></span>\n<span class="icon play"></span>\n<span class="icon pause"></span>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // layout.eco
    require.register('deadmonton/src/templates/layout.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<div id="map"></div>\n<canvas id="canvas"></canvas>\n<div id="controls" class="box"></div>\n<div id="date" class="box"></div>\n<div id="loading" class="box">Loading &hellip;</div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // canvas.coffee
    require.register('deadmonton/src/views/canvas.js', function(exports, require, module) {
    
      var Canvas, config, mediator,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      config = require('../config');
      
      mediator = require('../modules/mediator');
      
      Canvas = (function(_super) {
        __extends(Canvas, _super);
      
        Canvas.prototype.el = '#map';
      
        function Canvas() {
          var canvas;
          Canvas.__super__.constructor.apply(this, arguments);
          this.reset();
          canvas = document.getElementById("canvas");
          this.ctx = canvas.getContext("2d");
          $('#canvas').attr('width', config.window.width).attr('height', config.window.height);
          mediator.on('play', this.play, this);
          mediator.on('pause', this.pause, this);
          mediator.on('replay', this.reset, this);
        }
      
        Canvas.prototype.render = function() {
          var _this = this;
          $(this.el).css('width', "" + config.window.width + "px").css('height', "" + config.window.height + "px");
          this.map = new L.Map('map', {
            'center': new L.LatLng(53.5501, -113.5049),
            'zoom': 12,
            'zoomControl': false
          });
          this.map.on('movestart', function() {
            mediator.trigger('pause');
            return _this.frame(true);
          });
          this.map.on('moveend', function() {
            var particle, _i, _len, _ref, _results;
            if (!_this.particles.length) {
              return;
            }
            _ref = _this.particles;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              particle = _ref[_i];
              particle.point = _this.position(particle.l);
              _results.push(_this.draw(particle));
            }
            return _results;
          });
          return L.tileLayer.provider('Stamen.Toner').addTo(this.map);
        };
      
        Canvas.prototype.position = function(latLng) {
          return this.map.layerPointToContainerPoint(this.map.latLngToLayerPoint(latLng));
        };
      
        Canvas.prototype.frame = function(reset) {
          var method;
          if (reset == null) {
            reset = false;
          }
          method = ['source-out', 'copy'][+reset];
          this.ctx.globalCompositeOperation = method;
          this.ctx.fillStyle = "rgba(0,0,0,0.1)";
          this.ctx.fillRect(0, 0, config.window.width, config.window.height);
          return this.ctx.globalCompositeOperation = 'darker';
        };
      
        Canvas.prototype.draw = function(_arg) {
          var color, gradient, point, ttl;
          point = _arg.point, color = _arg.color, ttl = _arg.ttl;
          if (point.x < 0 || point.y < 0) {
            return;
          }
          gradient = this.ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, ttl);
          gradient.addColorStop(0.0, "white");
          gradient.addColorStop(0.8, "rgba(" + color + ",0.5)");
          gradient.addColorStop(1.0, "black");
          this.ctx.beginPath();
          this.ctx.fillStyle = gradient;
          this.ctx.arc(point.x, point.y, ttl, 0, Math.PI * 2, false);
          this.ctx.closePath();
          return this.ctx.fill();
        };
      
        Canvas.prototype.play = function() {
          var date,
            _this = this;
          date = $('#date');
          this.i1 = setInterval(function() {
            var go, particle;
            if (_this.now > _this.end) {
              return _this.stop();
            }
            date.html(_this.now.format("ddd, Do MMMM YYYY"));
            go = true;
            while (go && _this.index < _this.collection.length) {
              if (_this.now >= new Date((particle = _this.collection[_this.index]).t)) {
                particle.ttl = 10;
                particle.point = _this.position(particle.l);
                particle.color = config.colors[particle.c].join(',');
                _this.particles.push(particle);
                _this.index += 1;
              } else {
                go = false;
              }
            }
            return _this.now = _this.now.add('d', 1);
          }, 2e2);
          return this.i2 = setInterval(function() {
            var particle, _i, _len, _ref, _results;
            _this.frame();
            _ref = _this.particles;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              particle = _ref[_i];
              _this.draw(particle);
              if (particle.ttl > 3) {
                _results.push(particle.ttl -= 0.1);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }, 33);
        };
      
        Canvas.prototype.pause = function() {
          var i, _i, _len, _ref, _results;
          _ref = [this.i1, this.i2];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(clearInterval(i));
          }
          return _results;
        };
      
        Canvas.prototype.stop = function() {
          this.pause();
          return mediator.trigger('stop');
        };
      
        Canvas.prototype.reset = function() {
          this.pause();
          this.now = moment(new Date(this.collection[0].t));
          this.end = moment(new Date(this.collection[this.collection.length - 1].t));
          this.particles = [];
          return this.index = 0;
        };
      
        return Canvas;
      
      })(Backbone.View);
      
      module.exports = Canvas;
      
    });

    
    // controls.coffee
    require.register('deadmonton/src/views/controls.js', function(exports, require, module) {
    
      var Controls, mediator,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      Controls = (function(_super) {
        __extends(Controls, _super);
      
        Controls.prototype.el = '#controls';
      
        Controls.prototype.template = require('../templates/controls');
      
        Controls.prototype.events = {
          'click .icon.play': 'onPlay',
          'click .icon.pause': 'onPlay',
          'click .icon.replay': 'onReplay'
        };
      
        function Controls() {
          Controls.__super__.constructor.apply(this, arguments);
          this.playing = false;
          mediator.on('loaded', function() {
            return $(this.el).find('.icon.play').addClass('active');
          }, this);
          mediator.on('stop', function() {
            this.playing = false;
            $(this.el).find('.icon.play').removeClass('active');
            $(this.el).find('.icon.pause').removeClass('active');
            return $(this.el).find('.icon.replay').addClass('active');
          }, this);
          mediator.on('pause', function() {
            if (!this.playing) {
              return;
            }
            this.playing = false;
            $(this.el).find('.icon.play').addClass('active');
            return $(this.el).find('.icon.pause').removeClass('active');
          }, this);
        }
      
        Controls.prototype.onPlay = function(evt) {
          if (!$(evt.target).hasClass('active')) {
            return;
          }
          $(this.el).find('.play, .pause').toggleClass('active');
          this.playing = !this.playing;
          mediator.trigger(['pause', 'play'][+this.playing]);
          return $(this.el).find('.replay').addClass('active');
        };
      
        Controls.prototype.onReplay = function(evt) {
          var el;
          if (!(el = $(evt.target)).hasClass('active')) {
            return;
          }
          this.playing = true;
          $(this.el).find('.play').removeClass('active');
          $(this.el).find('.pause').addClass('active');
          mediator.trigger('replay');
          return mediator.trigger('play');
        };
      
        Controls.prototype.render = function() {
          $(this.el).html(this.template());
          return this;
        };
      
        return Controls;
      
      })(Backbone.View);
      
      module.exports = Controls;
      
    });

    
    // layout.coffee
    require.register('deadmonton/src/views/layout.js', function(exports, require, module) {
    
      var Canvas, Controls, Layout, mediator,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      Controls = require('./controls');
      
      Canvas = require('./canvas');
      
      mediator = require('../modules/mediator');
      
      Layout = (function(_super) {
        __extends(Layout, _super);
      
        Layout.prototype.el = 'body';
      
        Layout.prototype.template = require('../templates/layout');
      
        function Layout() {
          var _this = this;
          Layout.__super__.constructor.apply(this, arguments);
          this.views = [];
          mediator.on('loaded', function() {
            return $(this.el).find('#loading').hide();
          }, this);
          $.getJSON('data/crime.json', function(collection) {
            (new Canvas({
              collection: collection
            })).render();
            return mediator.trigger('loaded');
          });
        }
      
        Layout.prototype.render = function() {
          $(this.el).html(this.template());
          (new Controls()).render();
          return this;
        };
      
        return Layout;
      
      })(Backbone.View);
      
      module.exports = Layout;
      
    });
  })();

  // Return the main app.
  var main = require("deadmonton/src/app.js");

  // Global on server, window in browser.
  var root = this;

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
    define("deadmonton", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
    root["deadmonton"] = main;
  }

  // Alias our app.
  require.alias("deadmonton/src/app.js", "deadmonton/index.js");

  // Export internal loader?
  root.require = (typeof root.require !== 'undefined') ? root.require : require;
})();