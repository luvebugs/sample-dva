import {runSubscription, prefix, patchHistory} from './utils';

export default ({models = {}, subscriptions ={}, history = {}, store}) => {
    if (!store) {
        return;
    }
    // 重写 history.listen
    history = patchHistory(history);

    let unlisteners = Object.keys(history).length ? runSubscription(subscriptions, {
        dispatch: getDispatch(),
        history
    }) : [];

    for (const key in models) {
        const model = models[key];
        const {namespace, subscriptions} = model;
        unlisteners.concat(Object.keys(history).length ? runSubscription(subscriptions || {}, {
            dispatch: getDispatch(namespace),
            history
        }) : []);
    }
    
    return unlisteners;

    function getDispatch(namespace) {
        return (action) => {
            const {type} = action;
            return store.dispatch({
                ...action,
                type: prefix(type, namespace)
            });
        }
    }
}