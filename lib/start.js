'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactRouterRedux = require('react-router-redux');

var _history = require('history');

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var _ref$models = _ref.models,
        models = _ref$models === undefined ? [] : _ref$models,
        _ref$state = _ref.state,
        state = _ref$state === undefined ? {} : _ref$state,
        _ref$reducers = _ref.reducers,
        reducers = _ref$reducers === undefined ? {} : _ref$reducers,
        _ref$effects = _ref.effects,
        effects = _ref$effects === undefined ? {} : _ref$effects,
        _ref$actions = _ref.actions,
        actions = _ref$actions === undefined ? {} : _ref$actions,
        _ref$middlewares = _ref.middlewares,
        middlewares = _ref$middlewares === undefined ? [] : _ref$middlewares,
        router = _ref.router;


    var history = options.history || (0, _history.createBrowserHistory)();

    reducers.routing = _reactRouterRedux.routerReducer;
    middlewares.push((0, _reactRouterRedux.routerMiddleware)(history));

    var store = (0, _create2.default)({
        state: state,
        effects: effects,
        actions: actions,
        models: models,
        subscriptions: subscriptions,
        middlewares: middlewares,
        history: history,
        reducers: reducers
    });

    history({
        models: models,
        subscriptions: subscriptions,
        history: history,
        store: store
    });

    return _react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
            _reactRouterRedux.ConnectedRouter,
            { history: history },
            router({ history: history })
        )
    );
};

module.exports = exports['default'];