import { isFunction } from '../lib';

export type AddActionValue<State = any> = (...rest: any) => State;
export type ReturnCreateStore = ReturnType<typeof createStore>;

export function createStore<State = any>(defaultState: State) {
  type SubscribeEvent = (newState: State, prevState: State) => void;
  type SetValueFunction = (currValue: State) => State;

  let state = defaultState as State;
  let action: Record<string, AddActionValue<State>> = {};

  const subscribeEventList: SubscribeEvent[] = [];

  function getState() {
    return state;
  }

  function setState(nextState: State | SetValueFunction) {
    const prevState = getState();
    state = isFunction(nextState) ? (nextState as SetValueFunction)(state) : (nextState as State);

    subscribeEventList.forEach(function (subscribe) {
      subscribe(state, prevState);
    });
  }

  function onSubscribe(subscribeEvent: SubscribeEvent) {
    subscribeEventList.push(subscribeEvent);

    return function () {
      const idx = subscribeEventList.indexOf(subscribeEvent);
      subscribeEventList.splice(idx, 1);
    };
  }

  function setAction<ActionMaps extends Record<string, AddActionValue<State>>>(
    actionFunc: (getter: typeof getState) => ActionMaps,
  ) {
    type ReturnActionFuncKey = keyof ReturnType<typeof actionFunc>;
    const resActionFunc: Record<ReturnActionFuncKey, AddActionValue<State>> = actionFunc(getState);
    action = resActionFunc;

    return resActionFunc;
  }

  return {
    getState,
    setState,
    setAction,
    onSubscribe,
  };
}
