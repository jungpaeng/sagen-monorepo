import { createStore } from './createStore';
import { redux } from './redux';
import { composeMiddleware, Middleware } from './composeMiddleware';
import { computed } from './computed';

describe('createStore', () => {
  describe('basics', () => {
    it('exposes the public API', () => {
      const store = createStore(0);
      const methods = Object.keys(store).filter((key) => key);

      expect(methods.length).toBe(5);
      expect(methods).toContain('getState');
      expect(methods).toContain('setState');
      expect(methods).toContain('resetState');
      expect(methods).toContain('onSubscribe');
    });

    it('throws if defaultState is a function', () => {
      expect(() => createStore(() => null)).toThrow();
    });
  });

  describe('setter', () => {
    it('should be reset state', () => {
      const store = createStore(0);

      store.setState(100);
      expect(store.getState()).toBe(100);

      store.setState(100);
      expect(store.getState()).toBe(100);

      store.resetState();
      expect(store.getState()).toBe(0);
    });

    it('change object state', () => {
      const store = createStore({ a: 1, b: 2, c: { c1: 1, c2: 2 } });

      store.setState({ b: 3 });
      expect(store.getState()).toStrictEqual({ a: 1, b: 3, c: { c1: 1, c2: 2 } });

      store.setState((curr) => ({ c: { ...curr.c, c1: 10 } }));
      expect(store.getState()).toStrictEqual({ a: 1, b: 3, c: { c1: 10, c2: 2 } });
    });
  });

  describe('middleware', () => {
    it('should be called Middleware when setState is called', () => {
      const spy = jest.fn();
      const spyMiddleware: Middleware = (store) => (next) => (action) => {
        spy(action);
        next(action);
      };

      const store = createStore(0, composeMiddleware(spyMiddleware));

      store.setState(100);
      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toBe(100);
    });

    it('should be error when used setState in middleware', () => {
      const spy = jest.fn();
      const spyMiddleware: Middleware = (store) => (next) => (action) => {
        store.setState(1);
        spy(action);
        next(action);
      };

      const store = createStore(0, composeMiddleware(spyMiddleware));
      expect(() => store.setState(1)).toThrow();
    });
  });

  describe('reducer', () => {
    it('action to dispatch', () => {
      const store = createStore({ a: 0, b: 0 });
      const storeDispatch = redux<{ type: 'increase' | 'decrease'; by?: number }>(
        store,
        (state, { type, by = 1 }) => {
          switch (type) {
            case 'increase':
              return { a: state.a + by };
            case 'decrease':
              return { a: state.a - by };
          }
        },
      );

      storeDispatch({ type: 'increase' });
      expect(store.getState().a).toBe(1);
      expect(store.getState().b).toBe(0);
    });
  });

  describe('computed', () => {
    it('action to dispatch', () => {
      const store = createStore({ a: 0, b: 0 });
      const computedValue = computed(store, (state) => state.a + state.b);

      expect(computedValue()).toBe(0);

      store.setState({ a: 1 });
      expect(computedValue()).toBe(1);
    });
  });

  describe('subscription', () => {
    it('subscribe to setState', () => {
      let counter = 0;
      const store = createStore(0);

      const unSubscribe = store.onSubscribe(() => {
        counter++;
      });

      // change counter from subscribe
      store.setState(1);
      expect(counter).toBe(1);

      // not change counter
      unSubscribe();
      store.setState(0);
      expect(counter).toBe(1);
    });

    it('destroy subscription', () => {
      let counterA = 0;
      let counterB = 0;
      const store = createStore(0);

      store.onSubscribe(() => {
        counterA++;
      });
      store.onSubscribe(() => {
        counterB++;
      });

      // change counter from subscribe
      store.setState(1);
      expect(counterA).toBe(1);
      expect(counterB).toBe(1);

      // not change counter
      store.destroy();
      store.setState(0);
      expect(counterA).toBe(1);
      expect(counterB).toBe(1);
    });
  });
});
