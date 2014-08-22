// A standalone CommonJS loader.
(function(root) {
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
    if (!resolved) {
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
  };

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
      path = paths[i];
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
      } else if ('.' !== path[i] && '' !== path[i]) {
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
    };

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

  // Do we already have require loader?
  root.require = (typeof root.require !== 'undefined') ? root.require : require;

})(this);
// Concat modules and export them as an app.
(function(root) {

  // All our modules will use global require.
  (function() {
    
    // config.coffee
    root.require.register('deadmonton/src/config.js', function(exports, require, module) {
    
      module.exports = {
        'categories': {
          'Theft From Vehicle': {
            'rgb': [255, 237, 160],
            'active': true,
            'seriousness': 1
          },
          'Theft Of Vehicle': {
            'rgb': [254, 217, 118],
            'active': true,
            'seriousness': 2
          },
          'Theft Over $5000': {
            'rgb': [254, 217, 118],
            'active': true,
            'seriousness': 2
          },
          'Break and Enter': {
            'rgb': [253, 141, 60],
            'active': true,
            'seriousness': 4
          },
          'Robbery': {
            'rgb': [253, 141, 60],
            'active': true,
            'seriousness': 6
          },
          'Assault': {
            'rgb': [227, 26, 28],
            'active': true,
            'seriousness': 8
          },
          'Sexual Assaults': {
            'rgb': [227, 26, 28],
            'active': true,
            'seriousness': 10
          },
          'Homicide': {
            'rgb': [0, 0, 0],
            'active': true,
            'seriousness': 50
          }
        },
        'window': {
          'width': $(window).width(),
          'height': $(window).height()
        },
        'center': [53.5501, -113.5049]
      };
      
    });

    // categories.mustache
    root.require.register('deadmonton/src/templates/categories.js', function(exports, require, module) {
    
      module.exports = ["{{ #category:name }}","<li class=\"{{ #active }}active{{ /active }}\" on-click=\"toggle\">","    <span class=\"circle\" style=\"background:rgb({{ rgb }})\"></span> {{ name }}","</li>","{{ /category }}"].join("\n");
    });

    // controls.mustache
    root.require.register('deadmonton/src/templates/controls.js', function(exports, require, module) {
    
      module.exports = ["<span class=\"icon replay\" on-click='replay'></span>","<span class=\"icon play\" on-click='play'></span>","<span class=\"icon pause\" on-click='pause'></span>"].join("\n");
    });

    // layout.mustache
    root.require.register('deadmonton/src/templates/layout.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"map\"></div>","<canvas id=\"canvas\"></canvas>","","<div id=\"controls\" class=\"box\"></div>","<div id=\"date\" class=\"box\"></div>","<ul id=\"categories\" class=\"box\"></ul>","","<div id=\"loading\" class=\"box\">Loading &hellip;</div>"].join("\n");
    });

    // app.coffee
    root.require.register('deadmonton/src/views/app.js', function(exports, require, module) {
    
      var App, app, canvas, categories, controls, state;
      
      state = require('./state');
      
      controls = require('./controls');
      
      canvas = require('./canvas');
      
      categories = require('./categories');
      
      App = Ractive.extend({
        template: require('../templates/layout'),
        init: function() {
          var _this = this;
          state.observe('ready', function(isReady) {
            if (isReady) {
              return $(_this.el).find('#loading').hide();
            }
          });
          canvas.render('#map');
          controls.render('#controls');
          return categories.render('#categories');
        }
      });
      
      module.exports = app = new App();
      
      $.get('crime.json.lzma', function(i) {
        return LZMA.decompress(i.split(','), function(o) {
          canvas.set({
            'crime': JSON.parse(o)
          });
          return state.set('ready', true);
        });
      });
      
    });

    // canvas.coffee
    root.require.register('deadmonton/src/views/canvas.js', function(exports, require, module) {
    
      var Canvas, config, controls, state;
      
      config = require('../config');
      
      controls = require('./controls');
      
      state = require('./state');
      
      Canvas = Ractive.extend({
        init: function() {
          var a, b, _ref,
            _this = this;
          this.on('change', this.reset);
          state.observe('command', function(newCmd, oldCmd) {
            if (!oldCmd) {
              return;
            }
            switch (newCmd) {
              case 'pause':
              case 'stop':
                return _this.pause();
              case 'play':
                return _this.play();
              case 'replay':
                return _this.reset();
            }
          });
          $(this.el).css('width', "" + config.window.width + "px").css('height', "" + config.window.height + "px");
          _ref = config.center, a = _ref[0], b = _ref[1];
          this.map = new L.Map('map', {
            'center': new L.LatLng(a, b),
            'zoom': 12,
            'zoomControl': false
          });
          L.tileLayer.provider('Stamen.Toner').addTo(this.map);
          this.map.on('movestart', function() {
            state.set('command', 'pause');
            return _this.clear();
          });
          this.map.on('moveend', function() {
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
          this.heat = L.heatLayer([], {
            'maxZoom': 16,
            'radius': 10,
            'blur': 15
          }).addTo(this.map);
          this.ctx = document.getElementById("canvas").getContext("2d");
          this.ctx.globalCompositeOperation = 'darker';
          return $('#canvas').attr('width', config.window.width).attr('height', config.window.height);
        },
        position: function(latLng) {
          return this.map.layerPointToContainerPoint(this.map.latLngToLayerPoint(latLng));
        },
        clear: function() {
          return this.ctx.clearRect(0, 0, config.window.width, config.window.height);
        },
        draw: function(particle) {
          var gradient, point, radius, ttl;
          return;
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
        },
        play: function() {
          var date,
            _this = this;
          date = $('#date');
          this.i1 = setInterval(function() {
            var active, crime, go, particle, rgb, seriousness, _ref;
            if (_this.now > _this.end) {
              return state.set('command', 'stop');
            }
            date.html(_this.now.format("ddd, Do MMMM YYYY"));
            crime = _this.get('crime');
            go = true;
            while (go && _this.index < crime.length) {
              if (_this.now >= new Date((particle = crime[_this.index]).t)) {
                _ref = config.categories[particle.c], rgb = _ref.rgb, seriousness = _ref.seriousness, active = _ref.active;
                particle.ttl = 20;
                particle.point = _this.position(particle.l);
                particle.color = rgb.join(',');
                particle.seriousness = seriousness;
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
            _this.heat.setLatLngs((function() {
              var p, _i, _len, _ref, _results;
              _ref = _this.particles;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                p = _ref[_i];
                if (p.ttl !== 0) {
                  _results.push(p.l.concat([p.seriousness * p.ttl * 20]));
                }
              }
              return _results;
            })());
            _ref = _this.particles;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              particle = _ref[_i];
              _this.draw(particle);
              if (particle.ttl > 0) {
                _results.push(particle.ttl -= 0.1);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }, 33);
        },
        pause: function() {
          _.each([this.i1, this.i2], clearInterval);
          this.clear();
          return _.each(this.particles, this.draw, this);
        },
        reset: function() {
          var crime;
          this.pause();
          crime = this.get('crime');
          this.now = moment(new Date(crime[0].t));
          this.end = moment(new Date(crime[crime.length - 1].t));
          this.particles = [];
          return this.index = 0;
        }
      });
      
      module.exports = new Canvas();
      
    });

    // categories.coffee
    root.require.register('deadmonton/src/views/categories.js', function(exports, require, module) {
    
      var Categories, config, state;
      
      config = require('../config');
      
      state = require('./state');
      
      Categories = Ractive.extend({
        template: require('../templates/categories'),
        init: function() {
          return this.on('toggle', function(obj) {
            this.set("" + obj.keypath + ".active", !obj.context.active);
            return state.set('command', 'pause');
          });
        },
        data: {
          'category': config.categories
        }
      });
      
      module.exports = new Categories();
      
    });

    // controls.coffee
    root.require.register('deadmonton/src/views/controls.js', function(exports, require, module) {
    
      var Controls, canvas, state;
      
      canvas = require('./canvas');
      
      state = require('./state');
      
      Controls = Ractive.extend({
        template: require('../templates/controls'),
        init: function() {
          var _this = this;
          this.on('play', this.onPlay);
          this.on('pause', this.onPlay);
          this.on('replay', this.onReplay);
          state.observe('ready', function(isReady) {
            if (isReady) {
              return _this.onReady();
            }
          });
          return state.observe('command', function(newCmd, oldCmd) {
            if (!oldCmd) {
              return;
            }
            switch (newCmd) {
              case 'stop':
                return _this.onStop();
              case 'pause':
                return _this.onPause();
            }
          });
        },
        onPlay: function() {
          $(this.el).find('.play, .pause').toggleClass('active');
          $(this.el).find('.replay').addClass('active');
          return state.set('command', ['play', 'pause'][+state.get('playing')]);
        },
        onReplay: function() {
          $(this.el).find('.play').removeClass('active');
          $(this.el).find('.pause').addClass('active');
          state.set('command', 'replay');
          return state.set('command', 'play');
        },
        onReady: function() {
          return $(this.el).find('.icon.play').addClass('active');
        },
        onStop: function() {
          $(this.el).find('.icon.play, .icon.pause').removeClass('active');
          return $(this.el).find('.icon.replay').addClass('active');
        },
        onPause: function() {
          $(this.el).find('.icon.play').addClass('active');
          return $(this.el).find('.icon.pause').removeClass('active');
        }
      });
      
      module.exports = new Controls();
      
    });

    // state.coffee
    root.require.register('deadmonton/src/views/state.js', function(exports, require, module) {
    
      var state;
      
      module.exports = state = new Ractive({
        data: {
          command: 'stop',
          playing: false,
          ready: false
        }
      });
      
      state.observe('command', function(cmd) {
        this.set('playing', cmd === 'play');
        if (cmd === 'pause') {
          return this.set('command', 'n/a');
        }
      });
      
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
  

})(this);