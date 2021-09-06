import { renderHook, act } from '@testing-library/react-hooks';
import { createStore, computed, useSagenStore, useComputed } from '..';

describe('useSagenStore', () => {
  it('should return computed value', () => {
    const store = computed(createStore(0), (state) => state + 100);
    const { result: sagenStore } = renderHook(() => useSagenStore(store));
    const { result: computedState } = renderHook(() => useComputed(store));

    expect(sagenStore.current[0]).toBe(0);
    expect(computedState.current).toBe(100);

    act(() => sagenStore.current[1](100));
    expect(sagenStore.current[0]).toBe(100);
    expect(computedState.current).toBe(200);
  });

  it('should return state computed value', () => {
    const store = computed(createStore({ a: 0, b: 0 }), (state) => state.a + state.b);
    const { result: sagenStore } = renderHook(() => useSagenStore(store));
    const { result: computedState } = renderHook(() => useComputed(store));

    expect(sagenStore.current[0]).toStrictEqual({ a: 0, b: 0 });
    expect(computedState.current).toBe(0);

    act(() => sagenStore.current[1]({ a: 100 }));
    expect(sagenStore.current[0]).toStrictEqual({ a: 100, b: 0 });
    expect(computedState.current).toBe(100);
  });

  it('computed with selector', () => {
    const store = computed(createStore({ a: 0, b: 0 }), (state) => ({
      sum: state.a + state.b,
    }));
    const { result: sagenStore } = renderHook(() => useSagenStore(store));
    const { result: computedState } = renderHook(() => useComputed(store, (value) => value.sum));

    expect(sagenStore.current[0]).toStrictEqual({ a: 0, b: 0 });
    expect(computedState.current).toBe(0);

    act(() => sagenStore.current[1]({ b: 50 }));
    expect(sagenStore.current[0]).toStrictEqual({ a: 0, b: 50 });
    expect(computedState.current).toBe(50);

    act(() => sagenStore.current[1]({ a: 200 }));
    expect(sagenStore.current[0]).toStrictEqual({ a: 200, b: 50 });
    expect(computedState.current).toBe(250);
  });
});
