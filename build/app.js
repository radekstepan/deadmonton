(function(root, factory, dependenciesFactory, setup) {
  setup(root, factory, dependenciesFactory);
})(
this,
(function(require, exports, module, global, undefined) {

  var $$___src_config = {};
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

  var config;

config = $$___src_config;

module.exports = function() {
  var canvas, controls, ctx, height, name, tuple, width, _fn, _i, _j, _len, _len1, _ref, _ref1, _ref2;
  controls = {};
  _ref = ['rewind', 'play', 'pause'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    controls[name] = $("#controls .icon." + name);
  }
  _ref1 = [['play', 'pause'], ['pause', 'play']];
  _fn = function(tuple) {
    var a, b, el;
    a = tuple[0], b = tuple[1];
    return (el = controls[a]).on('click', function() {
      el.removeClass('active');
      return controls[b].addClass('active');
    });
  };
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    tuple = _ref1[_j];
    _fn(tuple);
  }
  _ref2 = document.querySelector('body').getBoundingClientRect(), width = _ref2.width, height = _ref2.height;
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
    a = moment(new Date(data[0].date));
    b = moment(new Date(data[data.length - 1].date));
    diff = b.diff(a, 'days');
    date = $('#date');
    i1 = setInterval(function() {
      var go, i, particle;
      if (a > b) {
        return (function() {
          var _k, _len2, _ref3, _results;
          _ref3 = [i1, i2];
          _results = [];
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            i = _ref3[_k];
            _results.push(clearInterval(i));
          }
          return _results;
        })();
      }
      date.html(a.format("ddd, Do MMMM YYYY"));
      go = true;
      while (go && data.length) {
        if (a >= new Date(data[0].date)) {
          particle = data.shift();
          particle.ttl = 10;
          particle.point = map.latLngToLayerPoint(particle.loc);
          particle.color = config.colors[particle.type].join(',');
          particles.push(particle);
        } else {
          go = false;
        }
      }
      return a = a.add('d', 1);
    }, 2e2);
    return i2 = setInterval(function() {
      var color, gradient, particle, point, rad, _k, _len2, _results;
      ctx.globalCompositeOperation = "source-out";
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'darker';
      _results = [];
      for (_k = 0, _len2 = particles.length; _k < _len2; _k++) {
        particle = particles[_k];
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