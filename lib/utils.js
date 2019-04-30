'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.runSubscription = runSubscription;
exports.reduceReducers = reduceReducers;
exports.combineSagas = combineSagas;
exports.patchHistory = patchHistory;
exports.prefix = prefix;

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NAMESPACE_DIVIDER = '/';

function runSubscription(subscriptions, args) {
    var unlisteners = (0, _keys2.default)(subscriptions).map(function (key) {
        return subscriptions[key](args);
    });
    return unlisteners;
}

function reduceReducers() {
    for (var _len = arguments.length, reducers = Array(_len), _key = 0; _key < _len; _key++) {
        reducers[_key] = arguments[_key];
    }

    return function (previous, current) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
        }

        return reducers.reduce(function (p, r) {
            return r.apply(undefined, [p, current].concat(args));
        }, previous);
    };
}

function combineSagas(sagas) {
    return (/*#__PURE__*/_regenerator2.default.mark(function _callee() {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _effects.all)(sagas.map(function (saga) {
                                return Array.isArray(saga) ? (0, _effects.all)(saga.map(function (watcher) {
                                    return (0, _effects.fork)(watcher);
                                })) : (0, _effects.fork)(saga);
                            }));

                        case 2:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })
    );
}

function patchHistory(history) {
    var listen = history.listen;

    history.listen = function (callback) {
        callback(history.location);
        listen.call(history, callback);
    };
    return history;
}

function prefix() {
    for (var _len3 = arguments.length, types = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        types[_key3] = arguments[_key3];
    }

    var type = types[0];

    if (!~type.indexOf(NAMESPACE_DIVIDER)) {
        return types.reduceRight(function (namespace, type) {
            return namespace ? '' + namespace + NAMESPACE_DIVIDER + type : type;
        });
    }
    return type;
}