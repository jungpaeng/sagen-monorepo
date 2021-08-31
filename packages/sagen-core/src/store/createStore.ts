import { isFunction } from '../lib';

export type StoreEnhancerStoreCreator<State = any> = (defaultState: State) => CreateStore<State>;
export type StoreEnhancer<State = any> = (
  next: StoreEnhancerStoreCreator<State>,
) => StoreEnhancerStoreCreator<State>;

export type SetValueFunction<State = any> = (currValue: State) => Partial<State>;
export type SubscribeEvent<State = any> = (newState: State, prevState: State) => void;

export type CreateStore<State = any> = {
  getState(): State;
  resetState(): void;
  setState(nextState: State | Partial<State> | SetValueFunction<State>): void;
  onSubscribe(subscribeEvent: SubscribeEvent<State>): () => void;
  destroy(): void;
};

export function createStore<State = any>(
  defaultState: State,
  enhancer?: StoreEnhancer<State>,
): CreateStore<State> {
  if (typeof defaultState === 'function')
    throw new Error('Passing a function as an argument to createStore() is not allowed.');

  // support redux middleware
  if (typeof enhancer === 'function') return enhancer(createStore)(defaultState);

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
