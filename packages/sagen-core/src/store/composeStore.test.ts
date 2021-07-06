import { createStore } from './createStore';
import { composeStore } from './composeStore';

describe('composeStore', () => {
  type ComposedNumberStore = {
    a: number;
    b: number;
  };

  type ComposeObjectStore = {
    a: { num: number };
    b: { num: number };
  };

  type ComposeDeepObjectStore = {
    a: { obj: { num: number }; arr: number[] };
    b: { obj: { num: number }; arr: number[] };
  };

  it('ignore prototype property', () => {
    // @ts-ignore
    Object.prototype.boo = 0;

    const numStoreA = createStore(0);
    const numStoreB = createStore(0);
    const { store: numStoreAB } = composeStore<ComposedNumberStore>({
      a: numStoreA,
      b: numStoreB,
    });

    expect(numStoreAB.getState()).toStrictEqual({ a: 0, b: 0 });
  });

  it('unsubscribe', function () {
    const numStoreA = createStore(0);
    const numStoreB = createStore(0);

    const { store: numStoreAB, unSyncStore } = composeStore<ComposedNumberStore>({
      a: numStoreA,
      b: numStoreB,
    });

    unSyncStore();
    numStoreAB.setState({ a: 1, b: 0 });

    expect(numStoreA.getState()).toBe(0);
    expect(numStoreAB.getState()).toStrictEqual({ a: 1, b: 0 });
  });

  it("return object have to store's default value", () => {
    const numStoreA = createStore(0);
    const numStoreB = createStore(0);

    const { store: numStoreAB } = composeStore<ComposedNumberStore>({
      a: numStoreA,
      b: numStoreB,
    });

    expect(numStoreA.getState()).toBe(0);
    expect(numStoreB.getState()).toBe(0);
    expect(numStoreAB.getState()).toStrictEqual({ a: 0, b: 0 });
  });

  describe('change original store when change compose store', () => {
    it('number', () => {
      const numStoreA = createStore(0);
      const numStoreB = createStore(0);

      const { store: numStoreAB } = composeStore<ComposedNumberStore>({
        a: numStoreA,
        b: numStoreB,
      });

      numStoreAB.setState({ a: 1, b: 0 });

      expect(numStoreA.getState()).toBe(1);
      expect(numStoreB.getState()).toBe(0);
      expect(numStoreAB.getState()).toStrictEqual({ a: 1, b: 0 });
    });

    it('object', () => {
      const objStoreA = createStore({ num: 0 });
      const objStoreB = createStore({ num: 0 });

      const { store: objStoreAB } = composeStore<ComposeObjectStore>({
        a: objStoreA,
        b: objStoreB,
      });

      objStoreAB.setState((curr) => ({ ...curr, a: { num: 1 } }));

      expect(objStoreA.getState()).toStrictEqual({ num: 1 });
      expect(objStoreB.getState()).toStrictEqual({ num: 0 });
      expect(objStoreAB.getState()).toStrictEqual({ a: { num: 1 }, b: { num: 0 } });
    });

    it('deep object', () => {
      const objStoreA = createStore({ obj: { num: 0 }, arr: [] });
      const objStoreB = createStore({ obj: { num: 0 }, arr: [] });

      const { store: objStoreAB } = composeStore<ComposeDeepObjectStore>({
        a: objStoreA,
        b: objStoreB,
      });

      objStoreAB.setState((curr) => ({ ...curr, a: { ...curr.a, obj: { num: 1 } } }));

      expect(objStoreA.getState()).toStrictEqual({ obj: { num: 1 }, arr: [] });
      expect(objStoreB.getState()).toStrictEqual({ obj: { num: 0 }, arr: [] });
      expect(objStoreAB.getState()).toStrictEqual({
        a: { obj: { num: 1 }, arr: [] },
        b: { obj: { num: 0 }, arr: [] },
      });
    });
  });

  describe('change compose store when change original store', () => {
    it('number', () => {
      const numStoreA = createStore(0);
      const numStoreB = createStore(0);

      const { store: numStoreAB } = composeStore<ComposedNumberStore>({
        a: numStoreA,
        b: numStoreB,
      });

      numStoreA.setState(1);

      expect(numStoreA.getState()).toBe(1);
      expect(numStoreB.getState()).toBe(0);
      expect(numStoreAB.getState()).toStrictEqual({ a: 1, b: 0 });
    });

    it('object', () => {
      const objStoreA = createStore({ num: 0 });
      const objStoreB = createStore({ num: 0 });

      const { store: objStoreAB } = composeStore<ComposeObjectStore>({
        a: objStoreA,
        b: objStoreB,
      });

      objStoreA.setState({ num: 1 });

      expect(objStoreA.getState()).toStrictEqual({ num: 1 });
      expect(objStoreB.getState()).toStrictEqual({ num: 0 });
      expect(objStoreAB.getState()).toStrictEqual({ a: { num: 1 }, b: { num: 0 } });
    });

    it('deep object', () => {
      const objStoreA = createStore({ obj: { num: 0 }, arr: [] });
      const objStoreB = createStore({ obj: { num: 0 }, arr: [] });

      const { store: objStoreAB } = composeStore<ComposeDeepObjectStore>({
        a: objStoreA,
        b: objStoreB,
      });

      objStoreA.setState((curr) => ({ ...curr, obj: { num: 1 } }));

      expect(objStoreA.getState()).toStrictEqual({ obj: { num: 1 }, arr: [] });
      expect(objStoreB.getState()).toStrictEqual({ obj: { num: 0 }, arr: [] });
      expect(objStoreAB.getState()).toStrictEqual({
        a: { obj: { num: 1 }, arr: [] },
        b: { obj: { num: 0 }, arr: [] },
      });
    });
  });
});
