(function(root, factory, dependenciesFactory, setup) {
  setup(root, factory, dependenciesFactory);
})(
this,
(function(require, exports, module, global, undefined) {

  var $$___src_views_controls = {};
$$___src_views_controls = (function(module, exports) {

  var Controls, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controls = (function(_super) {
  __extends(Controls, _super);

  function Controls() {
    _ref = Controls.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Controls.prototype.el = '#controls';

  Controls.prototype.template = JST.controls;

  Controls.prototype.events = {
    'click .icon.play': 'onPlay',
    'click .icon.pause': 'onPlay'
  };

  Controls.prototype.onPlay = function(evt) {
    return $(this.el).find('.play, .pause').toggleClass('active');
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

  var Controls, Layout,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controls = $$___src_views_controls;

Layout = (function(_super) {
  __extends(Layout, _super);

  Layout.prototype.el = 'body';

  Layout.prototype.template = JST.layout;

  function Layout() {
    Layout.__super__.constructor.apply(this, arguments);
    this.views = [];
  }

  Layout.prototype.render = function() {
    var view;
    $(this.el).html(Mustache.render(this.template, {}));
    this.views.push(view = new Controls());
    view.render();
    return this;
  };

  return Layout;

})(Backbone.View);

module.exports = Layout;


  return module.exports;
})({exports: $$___src_views_layout}, $$___src_views_layout);var $$___src_config = {};
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
  }
};


  return module.exports;
})({exports: $$___src_config}, $$___src_config);var $$___src_app = {};
$$___src_app = (function(module, exports) {

  var Layout, config;

config = $$___src_config;

Layout = $$___src_views_layout;

module.exports = function() {
  var canvas, ctx, height, width;
  (new Layout()).render();
  width = $(window).width();
  height = $(window).height();
  $('#map').css('width', "" + width + "px").css('height', "" + height + "px");
  $('#canvas').attr('width', width).attr('height', height);
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  return $.getJSON('data/crime.json', function(data) {
    var a, b, date, diff, i1, i2, map, particles;
    map = new L.Map('map', {
      'center': new L.LatLng(53.5501, -113.5049),
      'zoom': 12,
      'zoomControl': false
    });
    L.tileLayer.provider('Stamen.Toner').addTo(map);
    particles = [];
    a = moment(new Date(data[0].t));
    b = moment(new Date(data[data.length - 1].t));
    diff = b.diff(a, 'days');
    date = $('#date');
    i1 = setInterval(function() {
      var go, i, particle;
      if (a > b) {
        return (function() {
          var _i, _len, _ref, _results;
          _ref = [i1, i2];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(clearInterval(i));
          }
          return _results;
        })();
      }
      date.html(a.format("ddd, Do MMMM YYYY"));
      go = true;
      while (go && data.length) {
        if (a >= new Date(data[0].t)) {
          particle = data.shift();
          particle.ttl = 10;
          particle.point = map.latLngToLayerPoint(particle.l);
          particle.color = config.colors[particle.c].join(',');
          particles.push(particle);
        } else {
          go = false;
        }
      }
      return a = a.add('d', 1);
    }, 2e2);
    return i2 = setInterval(function() {
      var color, gradient, particle, point, rad, _i, _len, _results;
      ctx.globalCompositeOperation = "source-out";
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'darker';
      _results = [];
      for (_i = 0, _len = particles.length; _i < _len; _i++) {
        particle = particles[_i];
        point = particle.point, color = particle.color;
        rad = particle.ttl;
        gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, rad);
        gradient.addColorStop(0.0, "white");
        gradient.addColorStop(0.8, "rgba(" + color + ",0.5)");
        gradient.addColorStop(1.0, "black");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(point.x, point.y, rad, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        if (particle.ttl > 3) {
          _results.push(particle.ttl -= 0.1);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }, 33);
  });
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