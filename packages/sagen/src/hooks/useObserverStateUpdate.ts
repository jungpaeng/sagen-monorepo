import React from 'react';
import { CreateStore } from 'sagen-core';

import { defaultEqualityFn } from '../lib';
import { SagenState } from './useSagenState';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useObserverStateUpdate<Selected = never, State = any>(
  getState: () => State,
  onSubscribe: CreateStore['onSubscribe'],
  selector?: (value: State) => Selected,
  equalityFn = defaultEqualityFn,
) {
  const [, forceUpdate] = React.useReducer((curr: number) => curr + 1, 0) as [never, () => void];
  const selectedComputed = React.useCallback(
    (computed: State) => {
      return (selector ? selector(computed) : computed) as SagenState<Selected, State>;
    },
    [selector],
  );

  const state = getState();

  const computedRef = React.useRef(state);
  const selectorRef = React.useRef(selector);
  const equalityFnRef = React.useRef(equalityFn);
  const erroredRef = React.useRef(false);

  const currentSliceRef = React.useRef<SagenState<Selected, State>>();

  if (currentSliceRef.current === undefined) {
    currentSliceRef.current = selectedComputed(state);
  }

  let newComputedSlice: SagenState<Selected, State> | undefined;
  let hasNewComputedSlice = false;

  if (
    computedRef.current !== state ||
    selectorRef.current !== selector ||
    equalityFnRef.current !== equalityFn ||
    erroredRef.current
  ) {
    // Using local variables to avoid mutations in the render phase.
    newComputedSlice = selectedComputed(state);
    hasNewComputedSlice = !equalityFn(
      currentSliceRef.current as SagenState<Selected, State>,
      newComputedSlice,
    );
  }

  // Syncing changes in useEffect.
  useIsomorphicLayoutEffect(() => {
    if (hasNewComputedSlice) {
      currentSliceRef.current = newComputedSlice as SagenState<Selected, State>;
    }

    computedRef.current = state;
    selectorRef.current = selector;
    equalityFnRef.current = equalityFn;
    erroredRef.current = false;
  });

  const stateBeforeSubscriptionRef = React.useRef(state);
  useIsomorphicLayoutEffect(() => {
    const listener = () => {
      try {
        const nextState = getState();
        const nextStateSlice = selectorRef.current?.(nextState);

        if (
          !equalityFnRef.current(
            currentSliceRef.current as SagenState<Selected, State>,
            nextStateSlice,
          )
        ) {
          computedRef.current = nextState;
          currentSliceRef.current = nextStateSlice as SagenState<Selected, State>;
          forceUpdate();
        }
      } catch (error) {
        erroredRef.current = true;
        forceUpdate();
      }
    };

    const unSubscribe = onSubscribe(listener);

    if (getState() !== stateBeforeSubscriptionRef.current) {
      listener(); // state has changed before subscription
    }

    return unSubscribe;
  }, [getState, onSubscribe]);

  return hasNewComputedSlice
    ? (newComputedSlice as SagenState<Selected, State>)
    : currentSliceRef.current!;
}
