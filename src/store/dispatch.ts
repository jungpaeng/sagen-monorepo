import { AddActionValue, ReturnCreateStore } from './createStore';

export function createDispatch(store: ReturnCreateStore) {
  const { setState } = store;

  return function (actionFunc: AddActionValue, value?: any) {
    if (actionFunc) {
      const nextState = actionFunc(value);
      setState(nextState);
    }
  };
}
