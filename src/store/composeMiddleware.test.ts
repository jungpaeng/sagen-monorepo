import { CreateStore, createStore } from './createStore';
import { composeMiddleware, Middleware } from './composeMiddleware';

describe('composeMiddleware', () => {
  it('warns when setState during middleware setup', () => {
    const setStateMiddleware: Middleware<number> = function (store) {
      store.setState(100);
      return (next) => (action) => next(action);
    };

    expect(() => composeMiddleware(setStateMiddleware)(createStore)(0)).toThrow();
  });

  it('wraps dispatch method with middleware once', () => {
    const testMiddleware = function (spyMethod: jest.Mock): Middleware<number> {
      return (store) => {
        spyMethod(store);
        return (next) => (action) => next(action);
      };
    };

    const spy = jest.fn();
    const store: CreateStore<number> = composeMiddleware(testMiddleware(spy))(createStore)(0);

    store.setState((curr) => curr + 10);
    store.setState((curr) => curr + 100);

    // call once
    expect(spy.mock.calls.length).toEqual(1);

    // has store method
    expect(spy.mock.calls[0][0]).toHaveProperty('getState');
    expect(spy.mock.calls[0][0]).toHaveProperty('setState');

    expect(store.getState()).toEqual(110); // 0 + 10 + 100
  });
});
