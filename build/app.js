(function(root, factory, dependenciesFactory, setup) {
  setup(root, factory, dependenciesFactory);
})(
this,
(function(require, exports, module, global, undefined) {

  var $$___src_modules_mediator = {};
$$___src_modules_mediator = (function(module, exports) {

  module.exports = _.extend({}, Backbone.Events);


  return module.exports;
})({exports: $$___src_modules_mediator}, $$___src_modules_mediator);var $$___src_config = {};
$$___src_config = (function(module, exports) {

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


  return module.exports;
})({exports: $$___src_config}, $$___src_config);var $$___src_views_canvas = {};
$$___src_views_canvas = (function(module, exports) {

  var Canvas, config, mediator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = $$___src_config;

mediator = $$___src_modules_mediator;

Canvas = (function(_super) {
  __extends(Canvas, _super);

  Canvas.prototype.el = '#map';

  function Canvas() {
    var canvas;
    Canvas.__super__.constructor.apply(this, arguments);
    this.now = moment(new Date(this.collection[0].t));
    this.end = moment(new Date(this.collection[this.collection.length - 1].t));
    this.particles = [];
    this.index = 0;
    canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    $('#canvas').attr('width', config.window.width).attr('height', config.window.height);
    mediator.on('play', this.play, this);
    mediator.on('pause', this.pause, this);
  }

  Canvas.prototype.render = function() {
    $(this.el).css('width', "" + config.window.width + "px").css('height', "" + config.window.height + "px");
    this.map = new L.Map('map', {
      'center': new L.LatLng(53.5501, -113.5049),
      'zoom': 12,
      'zoomControl': false
    });
    return L.tileLayer.provider('Stamen.Toner').addTo(this.map);
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
          particle.point = _this.map.latLngToLayerPoint(particle.l);
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
      var color, gradient, particle, point, rad, _i, _len, _ref, _results;
      _this.ctx.globalCompositeOperation = "source-out";
      _this.ctx.fillStyle = "rgba(0,0,0,0.1)";
      _this.ctx.fillRect(0, 0, config.window.width, config.window.height);
      _this.ctx.globalCompositeOperation = 'darker';
      _ref = _this.particles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        point = particle.point, color = particle.color;
        rad = particle.ttl;
        gradient = _this.ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, rad);
        gradient.addColorStop(0.0, "white");
        gradient.addColorStop(0.8, "rgba(" + color + ",0.5)");
        gradient.addColorStop(1.0, "black");
        _this.ctx.beginPath();
        _this.ctx.fillStyle = gradient;
        _this.ctx.arc(point.x, point.y, rad, 0, Math.PI * 2, false);
        _this.ctx.closePath();
        _this.ctx.fill();
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
    this.particles = [];
    this.index = 0;
    return mediator.trigger('stop');
  };

  return Canvas;

})(Backbone.View);

module.exports = Canvas;


  return module.exports;
})({exports: $$___src_views_canvas}, $$___src_views_canvas);var $$___src_views_controls = {};
$$___src_views_controls = (function(module, exports) {

  var Controls, mediator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mediator = $$___src_modules_mediator;

Controls = (function(_super) {
  __extends(Controls, _super);

  Controls.prototype.el = '#controls';

  Controls.prototype.template = JST.controls;

  Controls.prototype.events = {
    'click .icon.play': 'onPlay',
    'click .icon.pause': 'onPlay'
  };

  function Controls() {
    Controls.__super__.constructor.apply(this, arguments);
    this.playing = false;
    mediator.on('loaded', function() {
      return $(this.el).find('.icon.play').addClass('active');
    }, this);
    mediator.on('stop', function() {
      $(this.el).find('.icon.play').removeClass('active');
      $(this.el).find('.icon.pause').removeClass('active');
      return $(this.el).find('.icon.replay').addClass('active');
    }, this);
  }

  Controls.prototype.onPlay = function(evt) {
    if (!$(evt.target).hasClass('active')) {
      return;
    }
    $(this.el).find('.play, .pause').toggleClass('active');
    this.playing = !this.playing;
    return mediator.trigger(['pause', 'play'][+this.playing]);
  };

  Controls.prototype.render = function() {
    $(this.el).html(Mustache.render(this.template, {}));
    return this;
  };

  return Controls;

})(Backbone.View);

module.exports = Controls;


  return module.exports;
})({exports: $$___src_views_controls}, $$___src_views_controls);var $$___src_views_layout = {};
$$___src_views_layout = (function(module, exports) {

  var Canvas, Controls, Layout, mediator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controls = $$___src_views_controls;

Canvas = $$___src_views_canvas;

mediator = $$___src_modules_mediator;

Layout = (function(_super) {
  __extends(Layout, _super);

  Layout.prototype.el = 'body';

  Layout.prototype.template = JST.layout;

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
    $(this.el).html(Mustache.render(this.template, {}));
    (new Controls()).render();
    return this;
  };

  return Layout;

})(Backbone.View);

module.exports = Layout;


  return module.exports;
})({exports: $$___src_views_layout}, $$___src_views_layout);var $$___src_app = {};
$$___src_app = (function(module, exports) {

  var Layout;

Layout = $$___src_views_layout;

module.exports = function() {
  return (new Layout()).render();
};


  return module.exports;
})({exports: $$___src_app}, $$___src_app);var $$___src_index = {};
$$___src_index = (function(module, exports) {

  $($$___src_app);

  return module.exports;
})({exports: $$___src_index}, $$___src_index);
    
  return $$___src_index;
}),
(function() {
  var require;

  

  return require;
}),
(function(root, factory, dependenciesFactory) {
  if(typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  }
  else {
    // provide a separate context for dependencies
    var depContext = {};
    var depAliases = {};
    var depReq = dependenciesFactory.call(depContext);
    var mod = {exports: {}};
    var exp = mod.exports;
    var exported = function(obj) {
      // check if the module exported anything
      if (typeof obj !== 'object') return true;
      for (var k in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        return true;
      }
      return false;
    };
    var req = function(id) {
      var alias = id;
      if (alias in depAliases) id = depAliases[alias];
      if (typeof depReq == 'function') {
        try {
          var exp = depReq(alias);
          if (exported(exp)) return exp;
        } catch (e) {
          if (id !== alias) {
            // it is possible that the module wasn't loaded yet and
            // its alias is not available in the depContext object
            try {
              exp = depReq(id);
              if (exported(exp)) return exp;
            } catch (e) {
            }
          }
        }
      }
      if (!(id in depContext) && !(id in root))
        throw new Error("Cannot find module '" + alias + "'");
      return depContext[id] || root[id];
    };
    mod = factory(req, exp, mod, self);

    if (typeof define === 'function' && define.amd) {
      define(
      [
      'module', 'exports', 'require'], function(module, exports, require) {
          module.exports = mod;
          return mod;
       });
    } else {
      
      root['deadmonton'] = mod;
      
    }
  }
})
);

//@ sourceMappingURL=app.js.map