export function createStore<State = any>(defaultState: State) {
  type AddActionValue = (...rest: any) => State;
  type SubscribeEvent = (newState: State, prevState: State) => void;

  let state = defaultState as State;
  let action: Record<string, AddActionValue> = {};

  const subscribeEventList: SubscribeEvent[] = [];

  function getState() {
    return state;
  }

  function setState(nextState: State) {
    const prevState = getState();
    state = nextState;

    subscribeEventList.forEach(function (subscribe) {
      subscribe(nextState, prevState);
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
