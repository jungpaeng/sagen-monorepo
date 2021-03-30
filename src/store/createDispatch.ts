import { AddActionValue, CreateStore } from './createStore';

export function createDispatch<State = any>(store: CreateStore<State>) {
  const { setState } = store;

  return function (actionFunc: AddActionValue, value?: any) {
    if (typeof actionFunc === 'function') {
      const nextState = actionFunc(value);
      setState(nextState);
    }
  };
}
