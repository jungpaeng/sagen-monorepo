import { renderHook, act } from '@testing-library/react-hooks';
import { createStore, redux, useSagenStore } from '..';

describe('useSagenStore', () => {
  it('should return default value', () => {
    const store = createStore(0);
    const { result } = renderHook(() => useSagenStore(store));

    expect(result.current[0]).toBe(0);
  });

  it('should return changed value', () => {
    const store = createStore(0);
    const { result } = renderHook(() => useSagenStore(store));

    act(() => result.current[1](100));
    expect(result.current[0]).toBe(100);
  });

  it('should get previous state value in setState', () => {
    const store = createStore(0);
    const { result } = renderHook(() => useSagenStore(store));

    act(() => result.current[1]((prev) => prev));
    expect(result.current[0]).toBe(0);

    act(() => result.current[1]((prev) => prev + 100));
    expect(result.current[0]).toBe(100);
  });

  it('should not change if set state pass prev state', () => {
    const store = createStore(0);
    const storeDispatch = redux<{ type: 'increase' | 'decrease'; by?: number }>(
      store,
      (state, { type, by = 1 }) => {
        switch (type) {
          case 'increase':
            return state + by;
          case 'decrease':
            return state - by;
        }
      },
    );

    const { result } = renderHook(() => useSagenStore(store));

    act(() => {
      storeDispatch({ type: 'increase' });
    });
    expect(result.current[0]).toBe(1);

    act(() => {
      storeDispatch({ type: 'increase', by: 100 });
    });
    expect(result.current[0]).toBe(101);
  });
});
