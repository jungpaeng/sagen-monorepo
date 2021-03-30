import { compose } from '../lib';
import { CreateStore, StoreEnhancerStoreCreator } from './createStore';

type MiddlewareAPI<State = any> = {
  getState: CreateStore<State>['getState'];
  setState: CreateStore<State>['setState'];
};
type MiddlewareChain<State = any> = (
  next: CreateStore<State>['setState'],
) => (action: State) => void;

export type Middleware<State = any> = (api: MiddlewareAPI<State>) => MiddlewareChain<State>;

export const composeMiddleware = function <State = any>(...middlewares: Middleware<State>[]) {
  return function (createStore: StoreEnhancerStoreCreator<State>) {
    return function (defaultState: State) {
      const store = createStore(defaultState);
      const { getState, setState } = store;

      let customSetState = () => {
        throw new Error('setState while constructing your middleware is not allowed.');
      };
      const middlewareChain = middlewares.map((middleware) =>
        middleware({ getState, setState: customSetState }),
      );
      customSetState = compose(...middlewareChain)(setState);

      return { ...store, setState: customSetState };
    };
  };
};
