import { CreateStore } from 'sagen-core';

import { defaultEqualityFn } from '../lib';
import { useObserverStateUpdate } from './useObserverStateUpdate';

export type SagenState<Selected = never, State = any> = [Selected] extends [never]
  ? State
  : Selected;

export function useSagenState<Selected = never, State = any>(
  store: CreateStore<State>,
  selector?: (value: State) => Selected,
  equalityFn = defaultEqualityFn,
): SagenState<Selected, State> {
  return useObserverStateUpdate(store.getState, store.onSubscribe, selector, equalityFn);
}
