import { CreateStore, SetValueFunction } from 'sagen-core';

export function useSetSagenState<State = any>(
  store: CreateStore<State>,
): (state: State | Partial<State> | SetValueFunction<State | Partial<State>>) => void {
  return store.setState;
}
