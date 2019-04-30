// import queryString from 'query-string';
import example from './example';

export default {
    state: {},
    reducers: {},
    effects: {},
    subscriptions: {
        setup({
            dispatch,
            history
        }) {
            return history.listen(({
                pathname,
                search
            } = {}) => {
                console.log(pathname, search);
            });
        },
    },
    models: [example]
};