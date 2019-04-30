import React from 'react';
import {Provider} from 'react-redux';
import {
    ConnectedRouter,
    routerMiddleware,
    routerReducer as routing,
} from 'react-router-redux';
import {createBrowserHistory} from 'history';

import create from './create';


export default ({models = [], state = {}, reducers = {}, effects = {}, actions = {}, middlewares = [], router}) => {

    const history = options.history || createBrowserHistory();
    
    reducers.routing = routing;
    middlewares.push(routerMiddleware(history));
    
    const store = create({
        state,
        effects,
        actions,
        models, 
        subscriptions,
        middlewares,
        history,
        reducers
    });

    history({
        models,
        subscriptions,
        history,
        store
    });
 
    return <Provider store={store}>
        <ConnectedRouter history={history}>
            {router({history})}
        </ConnectedRouter>
    </Provider>;
}
