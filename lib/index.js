'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _create2 = require('./create');

var _create3 = _interopRequireDefault(_create2);

var _start2 = require('./start');

var _start3 = _interopRequireDefault(_start2);

var _history2 = require('./history');

var _history3 = _interopRequireDefault(_history2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$models = options.models,
        models = _options$models === undefined ? [] : _options$models,
        _options$middlewares = options.middlewares,
        middlewares = _options$middlewares === undefined ? [] : _options$middlewares,
        _options$subscription = options.subscriptions,
        subscriptions = _options$subscription === undefined ? {} : _options$subscription,
        _options$actions = options.actions,
        actions = _options$actions === undefined ? {} : _options$actions,
        _options$effects = options.effects,
        effects = _options$effects === undefined ? {} : _options$effects,
        _options$reducers = options.reducers,
        reducers = _options$reducers === undefined ? {} : _options$reducers,
        initialState = options.state,
        injectPlugin = options.plugin;

    var store = null;
    var app = {
        // 生产一个 store
        create: function create() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$state = _ref.state,
                state = _ref$state === undefined ? initialState : _ref$state,
                _ref$plugin = _ref.plugin,
                plugin = _ref$plugin === undefined ? injectPlugin : _ref$plugin;

            store = (0, _create3.default)({
                state: state,
                reducers: reducers,
                effects: effects,
                actions: actions,
                models: models,
                subscriptions: subscriptions,
                middlewares: middlewares,
                plugin: plugin,
                history: options.history
            });
            return store;
        },

        // 添加 middleware
        use: function use(middleware) {
            middlewares.push(middleware);
        },

        // 添加 model
        model: function model(_model) {
            models.push(_model);
        },

        // router(router) {
        //     options.router = router;
        // },
        // 初始化 history, react-router4 history 必须在 create 方法之后调用
        history: function history(h) {
            if (!store) {
                console.log('not found store');
            }
            return (0, _history3.default)({
                history: h,
                models: models,
                subscriptions: subscriptions,
                store: store
            });
        },

        // 基础配置只需要以上 api，如果不想自定义 Provider 相关可以使用以下 api
        // start 方法可以直接返回一个 Provider
        start: function start(router) {
            if (!router) {
                console.log('not found router');
            }
            return (0, _start3.default)({
                state: state,
                reducers: reducers,
                effects: effects,
                actions: actions,
                models: models,
                subscriptions: subscriptions,
                middlewares: middlewares,
                history: options.history,
                router: router
            });
        }
    };
    return app;
};

module.exports = exports['default'];