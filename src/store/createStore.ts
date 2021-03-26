import { isFunction } from '../lib';

type SetValueFunction<State = any> = (currValue: State) => State;
type SubscribeEvent<State = any> = (newState: State, prevState: State) => void;

export type AddActionValue<State = any> = (...rest: any) => State;

type AddActionValueRecord<Key extends string | number | symbol, State = any> = Record<
  Key,
  AddActionValue<State>
>;

export interface CreateStore<State = any> {
  getState(): State;
  setState(nextState: State | SetValueFunction<State>): void;
  setAction<ActionMaps extends AddActionValueRecord<string, State>>(
    actionFunc: (getter: CreateStore['getState']) => ActionMaps,
  ): AddActionValueRecord<keyof ReturnType<typeof actionFunc>, State>;
  onSubscribe(subscribeEvent: SubscribeEvent<State>): () => void;
}

export function createStore<State = any>(defaultState: State): CreateStore<State> {
  if (typeof defaultState === 'function') {
    throw new Error('Passing a function as an argument to createStore() is not allowed.');
  }

  let state = defaultState as State;
  let action: Record<string, AddActionValue<State>> = {};

  const subscribeEventList: SubscribeEvent<State>[] = [];

  function getState() {
    return state;
  }

  const setState: CreateStore<State>['setState'] = function (nextState) {
    const prevState = getState();
    state = isFunction(nextState)
      ? (nextState as SetValueFunction<State>)(state)
      : (nextState as State);

    subscribeEventList.forEach(function (subscribe) {
      subscribe(state, prevState);
    });
  };

  const onSubscribe: CreateStore<State>['onSubscribe'] = function (subscribeEvent) {
    subscribeEventList.push(subscribeEvent);

    return function () {
      const idx = subscribeEventList.indexOf(subscribeEvent);
      subscribeEventList.splice(idx, 1);
    };
  };

  const setAction: CreateStore<State>['setAction'] = function (actionFunc) {
    action = actionFunc(getState);
    return <AddActionValueRecord<keyof ReturnType<typeof actionFunc>, State>>action;
  };

  return {
    getState,
    setState,
    setAction,
    onSubscribe,
  };
}
