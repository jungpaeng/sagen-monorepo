import { isFunction } from '../lib';

export function createStore<State = any>(defaultState: State) {
  type AddActionValue = (...rest: any) => State;
  type SubscribeEvent = (newState: State, prevState: State) => void;
  type SetValueFunction = (currValue: State) => State;

  let state = defaultState as State;
  let action: Record<string, AddActionValue> = {};

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

  function addAction(actionFunc: (get?: typeof getState) => Record<string, AddActionValue>) {
    const actionMap = actionFunc(getState);
    action = { ...action, ...actionMap };
  }

  function dispatch(key: string, actionValue?: any) {
    const actionFunc = action[key];

    if (actionFunc) {
      const nextState = actionFunc(actionValue);
      setState(nextState);
    }
  }

  return { getState, setState, dispatch, addAction, onSubscribe };
}
