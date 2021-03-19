export function createStore<State = any>(defaultState: State) {
  type SubscribeEvent = (newState: State, prevState: State) => void;

  let state: State;
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

  state = defaultState as State;
  return { getState, setState, onSubscribe };
}
