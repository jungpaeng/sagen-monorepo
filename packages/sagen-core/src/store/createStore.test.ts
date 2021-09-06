import { createStore } from './createStore';
import { redux } from './redux';

describe('createStore', () => {
  describe('basics', () => {
    it('exposes the public API', () => {
      const store = createStore(100);
      const methods = Object.keys(store).filter((key) => key);

      expect(methods.length).toBe(5);
      expect(methods).toContain('getState');
      expect(methods).toContain('setState');
      expect(methods).toContain('resetState');
      expect(methods).toContain('onSubscribe');
    });

    it('get state', () => {
      const store = createStore(100);
      expect(store.getState()).toBe(100);
    });

    it('get state from function default state', () => {
      const store = createStore(() => 100);
      expect(store.getState()).toBe(100);
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
