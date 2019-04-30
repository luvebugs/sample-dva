'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _effects = require('redux-saga/effects');

var sagaEffects = _interopRequireWildcard(_effects);

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getReducer(handlers, defaultState, namespace) {
    var reducers = (0, _keys2.default)(handlers).map(function (key) {
        var reducer = handlers[key];
        var actionType = (0, _utils.prefix)(key, namespace);
        return function (state, action) {
            var type = action.type;

            if (actionType === type) {
                return reducer(state, action);
            }
            return state;
        };
    });

    var reducer = _utils.reduceReducers.apply(undefined, (0, _toConsumableArray3.default)(reducers));
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
        var action = arguments[1];

        return reducer(state, action);
    };
}

function getSaga(handlers) {
    var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    function put(action) {
        var type = action.type;

        return sagaEffects.put((0, _extends3.default)({}, action, { type: (0, _utils.prefix)(type, namespace) }));
    }
    function take(type) {
        return sagaEffects.take((0, _utils.prefix)(type, namespace));
    }
    return (0, _keys2.default)(handlers).map(function (key) {
        var effect = /*#__PURE__*/_regenerator2.default.mark(function effect(_ref) {
            var resolve = _ref.RESOLVE,
                reject = _ref.REJECT,
                rest = (0, _objectWithoutProperties3.default)(_ref, ['RESOLVE', 'REJECT']);

            for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                params[_key - 1] = arguments[_key];
            }

            var result;
            return _regenerator2.default.wrap(function effect$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return handlers[key].apply(handlers, [rest].concat((0, _toConsumableArray3.default)(params.concat([(0, _extends3.default)({}, sagaEffects, { put: put, take: take, resolve: resolve, reject: reject })]))));

                        case 2:
                            result = _context.sent;

                            resolve(result);

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, effect, this);
        });
        var effectKey = (0, _utils.prefix)(key, namespace || '');
        var watcher = /*#__PURE__*/_regenerator2.default.mark(function watcher() {
            return _regenerator2.default.wrap(function watcher$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return sagaEffects.takeEvery(effectKey, effect);

                        case 2:
                            return _context2.abrupt('return', { put: put, take: take });

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, watcher, this);
        });
        return watcher;
    });
}

exports.default = function (_ref2) {
    var _ref2$state = _ref2.state,
        state = _ref2$state === undefined ? {} : _ref2$state,
        _ref2$reducers = _ref2.reducers,
        reducers = _ref2$reducers === undefined ? {} : _ref2$reducers,
        _ref2$effects = _ref2.effects,
        effects = _ref2$effects === undefined ? {} : _ref2$effects,
        _ref2$models = _ref2.models,
        models = _ref2$models === undefined ? [] : _ref2$models,
        _ref2$subscriptions = _ref2.subscriptions,
        subscriptions = _ref2$subscriptions === undefined ? {} : _ref2$subscriptions,
        _ref2$middlewares = _ref2.middlewares,
        middlewares = _ref2$middlewares === undefined ? [] : _ref2$middlewares,
        _ref2$history = _ref2.history,
        history = _ref2$history === undefined ? {} : _ref2$history,
        _ref2$plugin = _ref2.plugin,
        plugin = _ref2$plugin === undefined ? function () {
        return function (noop) {
            return noop;
        };
    } : _ref2$plugin;

    var sagas = getSaga(effects);

    var unlisteners = (0, _keys2.default)(history).length ? (0, _utils.runSubscription)(subscriptions, {
        dispatch: getDispatch(),
        history: history
    }) : [];

    var preloadedState = state;

    for (var key in models) {
        var model = models[key];

        var _model$namespace = model.namespace,
            namespace = _model$namespace === undefined ? key : _model$namespace,
            _model$state = model.state,
            _state = _model$state === undefined ? {} : _model$state;

        preloadedState[namespace] = _state;

        reducers[namespace] = getReducer(model.reducers || {}, _state, namespace);

        sagas.push(getSaga(model.effects || {}, namespace));

        unlisteners.concat((0, _keys2.default)(history).length ? (0, _utils.runSubscription)(model.subscriptions || {}, {
            dispatch: getDispatch(namespace),
            history: history
        }) : []);
    }

    var rootReducer = (0, _redux.combineReducers)(reducers);
    var rootSaga = (0, _utils.combineSagas)(sagas);

    var sagaMiddleware = (0, _reduxSaga2.default)();
    var actionMiddleware = function actionMiddleware(store) {
        return function (next) {
            return function (action) {
                if ((typeof action === 'undefined' ? 'undefined' : (0, _typeof3.default)(action)) === 'object') {
                    return new _promise2.default(function (resolve, reject) {
                        next((0, _extends3.default)({
                            RESOLVE: resolve,
                            REJECT: reject
                        }, action));
                    });
                }
                return next(action);
            };
        };
    };

    var enhancers = [_redux.applyMiddleware.apply(undefined, (0, _toConsumableArray3.default)(middlewares).concat([actionMiddleware, sagaMiddleware]))].concat(plugin ? [plugin(window)] : []);

    var store = (0, _redux.createStore)(rootReducer, preloadedState, _redux.compose.apply(undefined, (0, _toConsumableArray3.default)(enhancers)));

    function getDispatch(namespace) {
        return function (action) {
            var type = action.type;

            return store.dispatch((0, _extends3.default)({}, action, {
                type: (0, _utils.prefix)(type, namespace)
            }));
        };
    }

    sagaMiddleware.run(rootSaga);

    return store;
};

module.exports = exports['default'];