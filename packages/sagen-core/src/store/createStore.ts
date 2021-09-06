import { isFunction } from '../lib';

export type SetValueFunction<State = any> = (currValue: State) => Partial<State>;
export type SubscribeEvent<State = any> = (newState: State, prevState: State) => void;

export type CreateStore<State = any> = {
  getState(): State;
  resetState(): void;
  setState(nextState: State | Partial<State> | SetValueFunction<State>): void;
  onSubscribe(subscribeEvent: SubscribeEvent<State>): () => void;
  destroy(): void;
};

export type StateCreator<State = any> = (api: {
  getState: () => State;
  setState: (nextState: State | Partial<State> | SetValueFunction<State>) => void;
}) => State;

export function createStore<State = any>(
  stateCreator: State | StateCreator<State>,
): CreateStore<State> {
  let state: State;
  const subscribeEventListeners: Set<SubscribeEvent<State>> = new Set();

  const getState = () => state;
  const setState: CreateStore<State>['setState'] = (partial) => {
    const nextState = isFunction(partial)
      ? (partial as SetValueFunction<Partial<State>>)(state)
      : (partial as State);

    // Execute only if prev and next are different.
    if (nextState !== state) {
      const prevState = state;

      // Avoid using the spread operator every time.
      state =
        typeof state === 'object' ? Object.assign({}, state, nextState) : (nextState as State);
      subscribeEventListeners.forEach((subscribe) => subscribe(state, prevState));
    }
  };

  const defaultState =
    typeof stateCreator === 'function'
      ? (stateCreator as StateCreator<State>)({ getState, setState })
      : stateCreator;

  const resetState = () => {
    setState(defaultState);
  };

  const onSubscribe: CreateStore<State>['onSubscribe'] = function (subscribeEvent) {
    subscribeEventListeners.add(subscribeEvent);

    return () => subscribeEventListeners.delete(subscribeEvent);
  };

  const destroy = () => subscribeEventListeners.clear();
  const api = { getState, setState, resetState, onSubscribe, destroy };

  state = defaultState;
  return api;
}
