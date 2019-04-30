import { createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createSagaMiddleware, {takeEvery} from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';

import {reduceReducers, combineSagas, runSubscription, prefix} from './utils';

function getReducer(handlers, defaultState, namespace) {
    const reducers = Object.keys(handlers).map(key => {
        const reducer = handlers[key];
        const actionType = prefix(key, namespace);
        return (state, action) => {
            const {type} = action;
            if (actionType === type) {
                return reducer(state, action);
            }
            return state;
        };
    });

    const reducer = reduceReducers(...reducers);
    return (state = defaultState, action) => {
        return reducer(state, action)
    };
}

function getSaga(handlers, namespace = '') {
    function put(action) {
        const {type} = action;
        return sagaEffects.put({ ...action, type: prefix(type, namespace)});
    }
    function take(type) {
        return sagaEffects.take(prefix(type, namespace));
    }
    return Object.keys(handlers).map(key => {
        const effect = function* ({RESOLVE: resolve, REJECT: reject, ...rest}, ...params) {
            const result = yield handlers[key](rest, ...params.concat([{...sagaEffects, put, take, resolve, reject}]));
            resolve(result);
        };
        const effectKey = prefix(key, namespace || '');
        const watcher = function* () {
            yield sagaEffects.takeEvery(effectKey, effect);
            return {put, take};
        };
        return watcher
    });
}

export default ({state = {}, reducers = {}, effects = {}, models = [], subscriptions ={}, middlewares = [], history = {}, plugin = () => noop => noop}) => {
    let sagas = getSaga(effects);
    
    let unlisteners = Object.keys(history).length ? runSubscription(subscriptions, {
        dispatch: getDispatch(),
        history
    }) : [];
    

    let preloadedState = state;

    for (const key in models) {
        const model = models[key];
        const {namespace = key, state ={}} = model;
        preloadedState[namespace] = state;

        reducers[namespace] = getReducer(model.reducers || {}, state, namespace);

        sagas.push(getSaga(model.effects || {}, namespace));

        unlisteners.concat(Object.keys(history).length ? runSubscription(model.subscriptions || {}, {
            dispatch: getDispatch(namespace),
            history
        }) : []);
    }

    const rootReducer = combineReducers(reducers);
    const rootSaga = combineSagas(sagas);

    const sagaMiddleware = createSagaMiddleware();
    const actionMiddleware = (store) => (next) => (action) => {
        if (typeof action === 'object') {
            return new Promise((resolve, reject) => {
                next({
                    RESOLVE: resolve,
                    REJECT: reject,
                    ...action,
                });
            });
        }
        return next(action);
    };

    const enhancers = [
        applyMiddleware(...middlewares, actionMiddleware, sagaMiddleware),
    ].concat(plugin ? [plugin(window)] : []);
    
    const store = createStore(
        rootReducer,
        preloadedState,
        compose(...enhancers)
    );

    function getDispatch(namespace) {
        return (action) => {
            const {type} = action;
            return store.dispatch({
                ...action,
                type: prefix(type, namespace)
            });
        }
    }

    sagaMiddleware.run(rootSaga);

    return store;
}