import { isFunction } from '../lib';

export type StoreEnhancerStoreCreator<State = any> = (defaultState: State) => CreateStore<State>;
export type StoreEnhancer<State = any> = (
  next: StoreEnhancerStoreCreator<State>,
) => StoreEnhancerStoreCreator<State>;

export type SetValueFunction<State = any> = (currValue: State) => Partial<State>;
export type SubscribeEvent<State = any> = (newState: State, prevState: State) => void;

export type AddActionValue<State = any> = (...rest: any) => State;

type AddActionValueRecord<Key extends string | number | symbol, State = any> = Record<
  Key,
  AddActionValue<State>
>;

export type CreateStore<State = any> = {
  getState(): State;
  resetState(): void;
  setState(nextState: State | Partial<State> | SetValueFunction<State>): void;
  setAction<ActionMaps extends AddActionValueRecord<string, State>>(
    actionFunc: (getter: CreateStore<State>['getState']) => ActionMaps,
  ): AddActionValueRecord<keyof ReturnType<typeof actionFunc>, State>;
  onSubscribe(subscribeEvent: SubscribeEvent<State>): () => void;
};

export function createStore<State = any>(
  defaultState: State,
  enhancer?: StoreEnhancer<State>,
): CreateStore<State> {
  if (typeof defaultState === 'function')
    throw new Error('Passing a function as an argument to createStore() is not allowed.');
  if (typeof enhancer === 'function') return enhancer(createStore)(defaultState);

  let state: State;
  let action: Record<string, AddActionValue<State>> = {};
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

  const setAction: CreateStore<State>['setAction'] = function (actionFunc) {
    action = actionFunc(getState);
    return <AddActionValueRecord<keyof ReturnType<typeof actionFunc>, State>>action;
  };

  const destroy = () => subscribeEventListeners.clear();
  const api = {
    getState,
    setState,
    resetState,
    setAction,
    onSubscribe,
    destroy,
  };

  state = defaultState;

  return api;
}
