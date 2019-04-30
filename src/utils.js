import {all, fork} from 'redux-saga/effects';

const NAMESPACE_DIVIDER = '/';


export function runSubscription(subscriptions, args) {
    const unlisteners = Object.keys(subscriptions).map(key => {
        return subscriptions[key](args);
    })
    return unlisteners;
}

export function reduceReducers(...reducers){
    return (previous, current, ...args) => {
        return reducers.reduce((p, r) => {
            return r(p, current, ...args);
        }, previous);
    }
}

export function combineSagas(sagas) {
    return function* () {
        yield all(sagas.map(saga => Array.isArray(saga) ? all(saga.map(watcher => fork(watcher))) : fork(saga)));
    }
}

export function patchHistory(history) {
    const {listen} = history;
    history.listen = (callback) => {
        callback(history.location);
        listen.call(history, callback);
    };
    return history;
}

export function prefix(...types) {
    const [type] = types;
    if (!~type.indexOf(NAMESPACE_DIVIDER)) {
        return types.reduceRight((namespace, type) => {
            return namespace ? `${namespace}${NAMESPACE_DIVIDER}${type}` : type;
        });
    }
    return type;
}