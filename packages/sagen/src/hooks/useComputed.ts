import { ComputedStore } from 'sagen-core';

import { defaultEqualityFn } from '../lib';
import { useObserverStateUpdate } from './useObserverStateUpdate';

export function useComputed<Selected = never, Computed = any, State = any>(
  store: ComputedStore<Computed, State>,
  selector?: (value: Computed) => Selected,
  equalityFn = defaultEqualityFn,
) {
  return useObserverStateUpdate(store.getComputed, store.onSubscribe, selector, equalityFn);
}
