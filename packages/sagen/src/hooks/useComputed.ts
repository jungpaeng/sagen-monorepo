import React from 'react';
import { ComputedStore } from 'sagen-core';
import { defaultEqualityFn } from '../lib';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { SagenState } from './useSagenState';

export function useComputed<Selected = never, Computed = any, State = any>(
  store: ComputedStore<Computed, State>,
  selector?: (value: Computed) => Selected,
  equalityFn = defaultEqualityFn,
) {
  const [, forceUpdate] = React.useReducer((curr: number) => curr + 1, 0) as [never, () => void];
  const selectedComputed = React.useCallback(
    (computed: Computed) => {
      return (selector ? selector(computed) : computed) as SagenState<Selected, Computed>;
    },
    [selector],
  );

  const computed = store.getComputed();

  const computedRef = React.useRef(computed);
  const selectorRef = React.useRef(selector);
  const equalityFnRef = React.useRef(equalityFn);
  const erroredRef = React.useRef(false);

  const currentSliceRef = React.useRef<SagenState<Selected, Computed>>();
  if (currentSliceRef.current === undefined) {
    currentSliceRef.current = selectedComputed(computed);
  }

  let newComputedSlice: SagenState<Selected, Computed> | undefined;
  let hasNewComputedSlice = false;

  if (
    computedRef.current !== computed ||
    selectorRef.current !== selector ||
    equalityFnRef.current !== equalityFn ||
    erroredRef.current
  ) {
    // Using local variables to avoid mutations in the render phase.
    newComputedSlice = selectedComputed(computed);
    hasNewComputedSlice = !equalityFn(
      currentSliceRef.current as SagenState<Selected, Computed>,
      newComputedSlice,
    );
  }

  // Syncing changes in useEffect.
  useIsomorphicLayoutEffect(() => {
    if (hasNewComputedSlice) {
      currentSliceRef.current = newComputedSlice as SagenState<Selected, Computed>;
    }

    computedRef.current = computed;
    selectorRef.current = selector;
    equalityFnRef.current = equalityFn;
    erroredRef.current = false;
  });

  const stateBeforeSubscriptionRef = React.useRef(computed);
  useIsomorphicLayoutEffect(() => {
    const listener = () => {
      try {
        const nextState = store.getComputed();
        const nextStateSlice = selectorRef.current?.(nextState);

        if (
          !equalityFnRef.current(
            currentSliceRef.current as SagenState<Selected, Computed>,
            nextStateSlice,
          )
        ) {
          computedRef.current = nextState;
          currentSliceRef.current = nextStateSlice as SagenState<Selected, Computed>;
          forceUpdate();
        }
      } catch (error) {
        erroredRef.current = true;
        forceUpdate();
      }
    };

    const unSubscribe = store.onSubscribe(listener);

    if (store.getComputed() !== stateBeforeSubscriptionRef.current) {
      listener(); // state has changed before subscription
    }

    return unSubscribe;
  }, [store]);

  return hasNewComputedSlice
    ? (newComputedSlice as SagenState<Selected, Computed>)
    : currentSliceRef.current!;
}
