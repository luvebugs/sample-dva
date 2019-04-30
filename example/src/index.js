import React from 'react'
import {render} from 'react-dom'
import {createLogger} from 'redux-logger'
import {Router, Route, hashHistory} from 'react-router';
import {Provider} from 'react-redux';

import {
    routerMiddleware,
    syncHistoryWithStore,
    routerReducer as routing,
} from 'react-router-redux';

import registerServiceWorker from './registerServiceWorker';
import dva from './lib/index';
import App from './App'
import Home from './Home';
import About from './About'
import NotFound from './NotFound'

import './index.css';
import index from './models';

/**
 * app create
 */

const app = dva({
    ...index,
    reducers: {
        routing
    },
    plugin: window.__REDUX_DEVTOOLS_EXTENSION__
});


app.use(routerMiddleware(hashHistory));


if (process.env.NODE_ENV !== 'production') {
    app.use(createLogger());
}

// app.model(index);

const store = app.create();

const history = syncHistoryWithStore(hashHistory, store);

// history.listen((location) => console.log(location));

app.history(history);

render(
    <Provider store={store}>
        <Router history={history}>
                <Router path="/" component={App} >
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/about" component={About} />
                </Router>
                <Route path="*" component={NotFound} />
        </Router>
    </Provider>,
    document.getElementById('root')
)

registerServiceWorker();

/**
 * app start
 */ 
// const middlewares = [];

// if (process.env.NODE_ENV !== 'production') {
//     middlewares.push(createLogger())
// }

// const router = ({history}) => {
//     return <Router history={history}>
//         <Route path="/" component={App} />
//     </Router>;
// }

// const app = rail({
//     middlewares
// });

// app.model(index);
// app.router(router);

// const provider = app.start();

// render(
//     <span>{provider}</span>,
//     document.getElementById('root')
// )

// registerServiceWorker();
