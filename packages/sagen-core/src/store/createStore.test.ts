import { createStore } from './createStore';
import { createDispatch } from './createDispatch';
import { composeMiddleware, Middleware } from './composeMiddleware';

describe('createStore', () => {
  describe('basics', () => {
    it('exposes the public API', () => {
      const store = createStore(0);
      const methods = Object.keys(store).filter((key) => key);

      expect(methods.length).toBe(5);
      expect(methods).toContain('getState');
      expect(methods).toContain('setState');
      expect(methods).toContain('resetState');
      expect(methods).toContain('setAction');
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
      const store = createStore(0);
      const storeDispatch = createDispatch(store);
      const storeAction = store.setAction((get) => ({
        ADD: (num) => get() + num,
        INCREMENT: () => get() + 1,
      }));

      storeDispatch(storeAction.ADD, 10);
      expect(store.getState()).toBe(10);

      storeDispatch(storeAction.ADD, 10);
      expect(store.getState()).toBe(20);
    });

    it('wrong action to setState', () => {
      const store = createStore(0);
      const storeDispatch = createDispatch(store);
      store.setAction((get) => ({
        ADD: (num) => get() + num,
        INCREMENT: () => get() + 1,
      }));

      // @ts-ignore
      storeDispatch('INCREMENT');
      expect(store.getState()).toBe(0);
    });
  });

  it('subscribe to setState', () => {
    let counter = 0;
    const store = createStore(0);

    const unSubscribe = store.onSubscribe((newStgate, prevState) => {
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
});
