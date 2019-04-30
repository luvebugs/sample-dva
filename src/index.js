import create from './create';
import start from './start';
import history from './history';

export default (options = {}) => {
    const {models = [], middlewares = [], subscriptions = {}, actions = {}, effects = {}, reducers = {}, state: initialState, plugin: injectPlugin} = options;
    let store = null;
    const app = {
        // 生产一个 store
        create({state = initialState, plugin = injectPlugin} = {}) {
            store = create({
                state,
                reducers,
                effects,
                actions,
                models,
                subscriptions,
                middlewares,
                plugin,
                history: options.history
            });
            return store;
        },
        // 添加 middleware
        use(middleware) {
            middlewares.push(middleware);
        },
        // 添加 model
        model(model) {
            models.push(model);
        },
        // router(router) {
        //     options.router = router;
        // },
        // 初始化 history, react-router4 history 必须在 create 方法之后调用
        history(h) {
            if (!store) {
                console.log('not found store');
            }
            return history({
                history: h,
                models,
                subscriptions,
                store
            });
        },
        // 基础配置只需要以上 api，如果不想自定义 Provider 相关可以使用以下 api
        // start 方法可以直接返回一个 Provider
        start(router) {
            if (!router) {
                console.log('not found router');
            }
            return start({
                state,
                reducers,
                effects,
                actions,
                models,
                subscriptions,
                middlewares,
                history: options.history,
                router
            })
        }
    };
    return app;
};