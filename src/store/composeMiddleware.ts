import { compose } from '../lib';
import { CreateStore, StoreEnhancer, StoreEnhancerStoreCreator } from './createStore';

type MiddlewareAPI<State = any> = {
  getState: CreateStore<State>['getState'];
  setState: CreateStore<State>['setState'];
};
type Middleware<State = any> = (api: MiddlewareAPI<State>) => StoreEnhancer<State>;

export const composeMiddleware = function <State = any>(...middlewares: Middleware<State>[]) {
  return function (createStore: StoreEnhancerStoreCreator<State>) {
    return function (defaultState: State) {
      const store = createStore(defaultState);
      const middlewareChain = middlewares.map((middleware) =>
        middleware({ getState: store.getState, setState: store.setState }),
      );
      const setState = compose(...middlewareChain)(store.setState);

      return { ...store, setState };
    };
  };
};
