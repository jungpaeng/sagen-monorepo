import { CreateStore } from './createStore';

export type ComputedStore<Computed = any, State = any> = CreateStore<State> & {
  getComputed(): Computed;
};

export function computed<Computed = any, State = any>(
  store: CreateStore<State>,
  expression: (state: State) => Computed,
): ComputedStore<Computed, State> {
  const setWithComputed: CreateStore<State>['setState'] = (partial) => {
    store.setState(partial);
  };
  const getWithComputed = () => {
    return expression(store.getState());
  };

  return {
    ...store,
    setState: setWithComputed,
    getComputed: getWithComputed,
  };
}
