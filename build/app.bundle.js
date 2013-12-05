(function() {
  /**
   * Require the given path.
   *
   * @param {String} path
   * @return {Object} exports
   * @api public
   */
  var require = function(path, parent, orig) {
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

    var localRequire = function(path) {
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

  // Global on server, window in browser.
  var root = this;

  // Do we already have require loader?
  root.require = (typeof root.require !== 'undefined') ? root.require : require;

  // All our modules will use global require.
  (function() {
    
    
    // config.coffee
    root.require.register('deadmonton/src/config.js', function(exports, require, module) {
    
      module.exports = {
        'categories': {
          'Theft From Vehicle': {
            'rgb': [255, 237, 160],
            'active': true
          },
          'Theft Of Vehicle': {
            'rgb': [254, 217, 118],
            'active': true
          },
          'Theft Over $5000': {
            'rgb': [254, 217, 118],
            'active': true
          },
          'Break and Enter': {
            'rgb': [253, 141, 60],
            'active': true
          },
          'Robbery': {
            'rgb': [253, 141, 60],
            'active': true
          },
          'Assault': {
            'rgb': [227, 26, 28],
            'active': true
          },
          'Sexual Assaults': {
            'rgb': [227, 26, 28],
            'active': true
          },
          'Homicide': {
            'rgb': [0, 0, 0],
            'active': true
          }
        },
        'window': {
          'width': $(window).width(),
          'height': $(window).height()
        },
        'center': [53.5501, -113.5049]
      };
      
    });

    
    // mediator.coffee
    root.require.register('deadmonton/src/modules/mediator.js', function(exports, require, module) {
    
      module.exports = _.extend({}, Backbone.Events);
      
    });

    
    // view.coffee
    root.require.register('deadmonton/src/modules/view.js', function(exports, require, module) {
    
      var View,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      View = (function(_super) {
        __extends(View, _super);
      
        View.prototype.autorender = false;
      
        function View() {
          View.__super__.constructor.apply(this, arguments);
          this.views = [];
          if (this.autorender) {
            this.render();
          }
        }
      
        View.prototype.render = function() {
          return this;
        };
      
        return View;
      
      })(Backbone.View);
      
      module.exports = View;
      
    });

    
    // category.eco
    root.require.register('deadmonton/src/templates/category.js', function(exports, require, module) {
    
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
            __out.push('<span class="circle" style="background:rgb(');
          
            __out.push(__sanitize(this.rgb));
          
            __out.push(')"></span> ');
          
            __out.push(__sanitize(this.name));
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // layout.eco
    root.require.register('deadmonton/src/templates/layout.js', function(exports, require, module) {
    
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
            __out.push('<div id="map"></div>\n<canvas id="canvas"></canvas>\n\n<div id="controls" class="box">\n    <span class="icon replay"></span>\n    <span class="icon play"></span>\n    <span class="icon pause"></span>\n</div>\n<div id="date" class="box"></div>\n<ul id="categories" class="box"></ul>\n\n<div id="loading" class="box">Loading &hellip;</div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // app.coffee
    root.require.register('deadmonton/src/views/app.js', function(exports, require, module) {
    
      var App, Canvas, Categories, Controls, View, mediator,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      View = require('../modules/view');
      
      mediator = require('../modules/mediator');
      
      Controls = require('./controls');
      
      Categories = require('./categories');
      
      Canvas = require('./canvas');
      
      App = (function(_super) {
        __extends(App, _super);
      
        App.prototype.el = 'body';
      
        App.prototype.autorender = true;
      
        App.prototype.template = require('../templates/layout');
      
        function App() {
          App.__super__.constructor.apply(this, arguments);
          this.views = [];
          mediator.on('loaded', function() {
            return $(this.el).find('#loading').hide();
          }, this);
          $.get('crime.json.lzma', function(i) {
            return LZMA.decompress(i.split(','), function(o) {
              var collection;
              collection = JSON.parse(o);
              new Canvas({
                collection: collection
              });
              return mediator.trigger('loaded');
            });
          });
        }
      
        App.prototype.render = function() {
          $(this.el).html(this.template());
          new Controls();
          new Categories();
          return this;
        };
      
        return App;
      
      })(View);
      
      module.exports = App;
      
    });

    
    // canvas.coffee
    root.require.register('deadmonton/src/views/canvas.js', function(exports, require, module) {
    
      var Canvas, View, config, mediator,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      config = require('../config');
      
      View = require('../modules/view');
      
      mediator = require('../modules/mediator');
      
      Canvas = (function(_super) {
        __extends(Canvas, _super);
      
        Canvas.prototype.el = '#map';
      
        Canvas.prototype.autorender = true;
      
        function Canvas() {
          this.draw = __bind(this.draw, this);
          Canvas.__super__.constructor.apply(this, arguments);
          this.reset();
          this.ctx = document.getElementById("canvas").getContext("2d");
          this.ctx.globalCompositeOperation = 'darker';
          $('#canvas').attr('width', config.window.width).attr('height', config.window.height);
          mediator.on('play', this.play, this);
          mediator.on('pause', this.pause, this);
          mediator.on('replay', this.reset, this);
          mediator.on('redraw', this.redraw, this);
        }
      
        Canvas.prototype.render = function() {
          var a, b, _ref,
            _this = this;
          $(this.el).css('width', "" + config.window.width + "px").css('height', "" + config.window.height + "px");
          _ref = config.center, a = _ref[0], b = _ref[1];
          this.map = new L.Map('map', {
            'center': new L.LatLng(a, b),
            'zoom': 12,
            'zoomControl': false
          });
          L.tileLayer.provider('Stamen.Toner').addTo(this.map);
          this.map.on('movestart', function() {
            mediator.trigger('pause');
            return _this.clear();
          });
          return this.map.on('moveend', function() {
            var particle, _i, _len, _ref1, _results;
            if (!_this.particles.length) {
              return;
            }
            _ref1 = _this.particles;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              particle = _ref1[_i];
              particle.point = _this.position(particle.l);
              _results.push(_this.draw(particle));
            }
            return _results;
          });
        };
      
        Canvas.prototype.position = function(latLng) {
          return this.map.layerPointToContainerPoint(this.map.latLngToLayerPoint(latLng));
        };
      
        Canvas.prototype.clear = function() {
          return this.ctx.clearRect(0, 0, config.window.width, config.window.height);
        };
      
        Canvas.prototype.draw = function(particle) {
          var gradient, point, radius, ttl;
          point = particle.point, ttl = particle.ttl;
          if (point.x < 0 || point.y < 0) {
            return;
          }
          if (!config.categories[particle.c].active) {
            return;
          }
          radius = ttl * 0.1 * this.map.getZoom();
          gradient = this.ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
          gradient.addColorStop(0.0, "white");
          gradient.addColorStop(0.8, "rgba(" + particle.color + ",0.5)");
          gradient.addColorStop(1.0, "black");
          this.ctx.beginPath();
          this.ctx.fillStyle = gradient;
          this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
          this.ctx.closePath();
          return this.ctx.fill();
        };
      
        Canvas.prototype.play = function() {
          var date,
            _this = this;
          this.playing = true;
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
                particle.color = config.categories[particle.c].rgb.join(',');
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
            _this.clear();
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
          this.playing = false;
          return _.each([this.i1, this.i2], clearInterval);
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
      
        Canvas.prototype.redraw = function() {
          if (this.playing) {
            return;
          }
          this.clear();
          return _.each(this.particles, this.draw);
        };
      
        return Canvas;
      
      })(View);
      
      module.exports = Canvas;
      
    });

    
    // categories.coffee
    root.require.register('deadmonton/src/views/categories.js', function(exports, require, module) {
    
      var Categories, Category, View, config,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      View = require('../modules/view');
      
      config = require('../config');
      
      Category = require('./category');
      
      Categories = (function(_super) {
        __extends(Categories, _super);
      
        Categories.prototype.el = '#categories';
      
        Categories.prototype.autorender = true;
      
        function Categories() {
          Categories.__super__.constructor.apply(this, arguments);
        }
      
        Categories.prototype.render = function() {
          var data, name, view, _ref;
          _ref = config.categories;
          for (name in _ref) {
            data = _ref[name];
            this.views.push(view = new Category({
              'model': _.extend(data, {
                name: name
              })
            }));
            $(this.el).append(view.el);
          }
          return this;
        };
      
        return Categories;
      
      })(View);
      
      module.exports = Categories;
      
    });

    
    // category.coffee
    root.require.register('deadmonton/src/views/category.js', function(exports, require, module) {
    
      var Category, View, config, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      View = require('../modules/view');
      
      mediator = require('../modules/mediator');
      
      config = require('../config');
      
      Category = (function(_super) {
        __extends(Category, _super);
      
        function Category() {
          _ref = Category.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        Category.prototype.autorender = true;
      
        Category.prototype.tagName = 'li';
      
        Category.prototype.template = require('../templates/category');
      
        Category.prototype.events = {
          'click': 'onToggle'
        };
      
        Category.prototype.render = function() {
          var el;
          (el = $(this.el)).html(this.template(this.model));
          if (this.model.active) {
            el.addClass('active');
          }
          return this;
        };
      
        Category.prototype.onToggle = function() {
          $(this.el).toggleClass('active');
          this.model.active = !this.model.active;
          return mediator.trigger('redraw');
        };
      
        return Category;
      
      })(View);
      
      module.exports = Category;
      
    });

    
    // controls.coffee
    root.require.register('deadmonton/src/views/controls.js', function(exports, require, module) {
    
      var Controls, View, mediator,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      View = require('../modules/view');
      
      mediator = require('../modules/mediator');
      
      Controls = (function(_super) {
        __extends(Controls, _super);
      
        Controls.prototype.el = '#controls';
      
        Controls.prototype.autorender = true;
      
        Controls.prototype.events = {
          'click .icon.play.active': 'onPlay',
          'click .icon.pause.active': 'onPlay',
          'click .icon.replay.active': 'onReplay'
        };
      
        Controls.prototype.playing = false;
      
        function Controls() {
          Controls.__super__.constructor.apply(this, arguments);
          mediator.on('loaded', this.onReady, this);
          mediator.on('stop', this.onStop, this);
          mediator.on('pause', this.onPause, this);
        }
      
        Controls.prototype.onPlay = function(evt) {
          $(this.el).find('.play, .pause').toggleClass('active');
          this.playing = !this.playing;
          $(this.el).find('.replay').addClass('active');
          return mediator.trigger(['pause', 'play'][+this.playing]);
        };
      
        Controls.prototype.onReplay = function(evt) {
          this.playing = true;
          $(this.el).find('.play').removeClass('active');
          $(this.el).find('.pause').addClass('active');
          mediator.trigger('replay');
          return mediator.trigger('play');
        };
      
        Controls.prototype.onReady = function() {
          return $(this.el).find('.icon.play').addClass('active');
        };
      
        Controls.prototype.onStop = function() {
          this.playing = false;
          $(this.el).find('.icon.play, .icon.pause').removeClass('active');
          return $(this.el).find('.icon.replay').addClass('active');
        };
      
        Controls.prototype.onPause = function() {
          if (!this.playing) {
            return;
          }
          this.playing = false;
          $(this.el).find('.icon.play').addClass('active');
          return $(this.el).find('.icon.pause').removeClass('active');
        };
      
        return Controls;
      
      })(View);
      
      module.exports = Controls;
      
    });
  })();

  // Return the main app.
  var main = root.require("deadmonton/src/views/app.js");

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
  
  root.require.alias("deadmonton/src/views/app.js", "deadmonton/index.js");
  
})();