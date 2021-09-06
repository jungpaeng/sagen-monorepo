import { CreateStore } from './createStore';

export type ComputedStore<Computed = any, State = any> = CreateStore<State> & {
  getComputed(): Computed;
};

export function computed<Computed = any, State = any>(
  store: CreateStore<State>,
  expression: (state: State) => Computed,
): ComputedStore<Computed, State> {
  let computedStore = expression(store.getState());

  const getWithComputed = () => {
    return computedStore;
  };

  const setWithComputed: CreateStore<State>['setState'] = (partial) => {
    store.setState(partial);

    const currentStore = store.getState();
    computedStore = expression(currentStore);
  };

  return {
    ...store,
    setState: setWithComputed,
    getComputed: getWithComputed,
  };
}
