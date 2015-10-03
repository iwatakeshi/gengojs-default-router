/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * Router
 * This module parses the routes
 * and sets the dot notation
 * according to the path.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cldr = require('cldr');

var _cldr2 = _interopRequireDefault(_cldr);

var _gengojsDebug = require('gengojs-debug');

var _gengojsDebug2 = _interopRequireDefault(_gengojsDebug);

var log = (0, _gengojsDebug2['default'])('router');

var Path = (function () {
  function Path(path) {
    _classCallCheck(this, Path);

    // If the string contains favico.ico
    // replace it with an empty string
    this.path = path.replace('favicon.ico', '');
  }

  /* Private: Checks if the string is a locale */

  _createClass(Path, [{
    key: 'isLocale',
    value: function isLocale(str) {
      str = str.toLowerCase().replace('-', '_');
      // Compare the locales against cldr
      return _lodash2['default'].contains(_cldr2['default'].localeIds, str);
    }

    /* Converts the path to an Array */
  }, {
    key: 'toArray',
    value: function toArray(path) {
      path = path ? path.split('/') : this.path.split('/');
      var filtered = [],
          result = [];
      var version = /\d{1,2}(\.)\d{1,2}((\.)\d{1,2})?$/;
      if (path.length < 3) {
        // It's safe to say that path[0] will always be ''
        // so add the second '' and define it as the index
        if (path[1] === '') {
          result.push('index');
        } else {
          // Make sure the path does not contain a locale
          // and maybe something does exist besides ''? (precaution)
          if (!this.isLocale(path[1])) result.push(path[1]);
        }
      } else {
        // For every item in the path
        // check to see if it contains a version or
        // if it's a regular name, then add it to the
        // filtered array
        _lodash2['default'].forEach(path, function (item) {
          //Make sure the path does not contain a locale
          if (!this.isLocale(item)) if (item.match(version)) {
            // Prevent the version dots from being
            // interpreted as a dot notation
            filtered.push(item.replace('.', '*'));
          } else {
            filtered.push(item);
          }
        }, this);

        path = filtered;
        // Once we have filtered
        for (var count = 1; count < path.length; count++) {
          // Make sure the path does not contain a locale
          if (!this.isLocale(path[count])) if (count === 1) {
            if (path[count] === '') result.push('index');else result.push(path[count]);
          } else {
            // Make sure nothing else is empty
            if (path[count] !== '') result.push(path[count]);
          }
        }
      }
      return result;
    }
  }, {
    key: 'toDot',
    value: function toDot(array) {
      array = array ? array : this.toArray();
      if (array.length > 1) return array.join().replace(/,/g, '.');else return array[0];
    }
  }]);

  return Path;
})();

var Router = (function (_Path) {
  _inherits(Router, _Path);

  function Router(path, enabled) {
    _classCallCheck(this, Router);

    _get(Object.getPrototypeOf(Router.prototype), 'constructor', this).call(this, path);
    this.enabled = enabled;
  }

  _createClass(Router, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return this.enabled;
    }
  }]);

  return Router;
})(Path);

exports['default'] = function () {
  'use strict';
  return {
    main: function ship(req) {
      // Set options
      var options = this.options.router;
      // Expose internal API
      this.router = new Router(req.path, options.enabled);
      // Debug
      if (this.router && options.enabled) log.debug('path:', this.router.path, 'toArray:', this.router.toArray(), 'toDot:', this.router.toDot());
    },
    'package': _lodash2['default'].merge({
      type: 'router'
    }, require('../package')),
    defaults: require('../defaults'),
    // Export the class for
    // test purposes
    mock: Router
  };
};

module.exports = exports['default'];
//# sourceMappingURL=source maps/index.js.map