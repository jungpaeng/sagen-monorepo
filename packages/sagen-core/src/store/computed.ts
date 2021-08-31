import { CreateStore } from './createStore';

export function computed<Computed = any, State = any>(
  store: CreateStore<State>,
  expression: (state: State) => Computed,
) {
  return () => expression(store.getState());
}
