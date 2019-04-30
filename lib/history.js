'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var _ref$models = _ref.models,
        models = _ref$models === undefined ? {} : _ref$models,
        _ref$subscriptions = _ref.subscriptions,
        subscriptions = _ref$subscriptions === undefined ? {} : _ref$subscriptions,
        _ref$history = _ref.history,
        history = _ref$history === undefined ? {} : _ref$history,
        store = _ref.store;

    if (!store) {
        return;
    }
    // 重写 history.listen
    history = (0, _utils.patchHistory)(history);

    var unlisteners = (0, _keys2.default)(history).length ? (0, _utils.runSubscription)(subscriptions, {
        dispatch: getDispatch(),
        history: history
    }) : [];

    for (var key in models) {
        var model = models[key];
        var namespace = model.namespace,
            _subscriptions = model.subscriptions;

        unlisteners.concat((0, _keys2.default)(history).length ? (0, _utils.runSubscription)(_subscriptions || {}, {
            dispatch: getDispatch(namespace),
            history: history
        }) : []);
    }

    return unlisteners;

    function getDispatch(namespace) {
        return function (action) {
            var type = action.type;

            return store.dispatch((0, _extends3.default)({}, action, {
                type: (0, _utils.prefix)(type, namespace)
            }));
        };
    }
};

module.exports = exports['default'];