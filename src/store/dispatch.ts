import { AddActionValue, CreateStore } from './createStore';

export function createDispatch<State = any>(store: CreateStore<State>) {
  const { setState } = store;

  return function (actionFunc: AddActionValue, value?: any) {
    if (actionFunc) {
      const nextState = actionFunc(value);
      setState(nextState);
    }
  };
}
