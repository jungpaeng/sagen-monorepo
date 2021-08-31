import { CreateStore } from './createStore';

export function redux<Action extends { type: unknown }, State = any>(
  store: CreateStore<State>,
  reducer: (state: State, action: Action) => Partial<State>,
) {
  return (action: Action) => {
    store.setState((curr) => reducer(curr, action));
    return action;
  };
}
