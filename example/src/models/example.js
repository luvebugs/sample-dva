// import queryString from 'query-string';

export default {
    namespace: 'example',
    state: {
        count: 0
    },
    actions: {
        // save(payload) {
        //     return {
        //         type: 'example/fetch',
        //         payload
        //     };
        // }
    },
    reducers: {
        save(state, {
            payload
        }) {
            return { ...state,
                ...payload
            };
        },
    },
    effects: {
        * fetch({
            payload
        }, {
            call,
            put,
            resolve
        }) {
            /* eslint-disable */
            function query() {
                return new Promise(
                    (resolve) => {
                        setTimeout(() => {
                            resolve(10000);
                        }, 3000)
                    }
                )
            }
            const data = yield call(query, {...payload});
            yield put({
                type: 'save',
                payload: {
                    count: data
                },
            });
            return data;
        }
    },
    subscriptions: {
        setup({
            dispatch,
            history
        }) {
            return history.listen(({
                pathname,
                search
            } = {}) => {
                // console.log(pathname, search);
                // const query = queryString.parse(search);
                dispatch({
                    type: 'save',
                    payload: {
                        count: 1
                    }
                });
            });
        },
    },
};