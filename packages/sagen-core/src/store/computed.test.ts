import { createStore } from './createStore';
import { redux } from './redux';
import { computed } from './computed';

describe('computed', () => {
  describe('basics', () => {
    it('getComputed', () => {
      const store = computed(createStore({ numA: 0, numB: 0 }), (state) => state.numA + state.numB);

      expect(store.getState()).toStrictEqual({ numA: 0, numB: 0 });
      expect(store.getComputed()).toEqual(0);

      store.setState({ numA: 100 });
      expect(store.getState()).toStrictEqual({ numA: 100, numB: 0 });
      expect(store.getComputed()).toEqual(100);
    });

    it('get object computed state', () => {
      const store = computed(createStore({ numA: 0, numB: 0 }), (state) => ({
        isEnough: state.numA + state.numB > 100 ? 'enough' : 'not enough',
        numAB: state.numA + state.numB,
      }));

      expect(store.getState()).toStrictEqual({ numA: 0, numB: 0 });
      expect(store.getComputed()).toStrictEqual({ isEnough: 'not enough', numAB: 0 });

      store.setState({ numA: 50 });
      expect(store.getState()).toStrictEqual({ numA: 50, numB: 0 });
      expect(store.getComputed()).toStrictEqual({ isEnough: 'not enough', numAB: 50 });

      store.setState({ numB: 200 });
      expect(store.getState()).toStrictEqual({ numA: 50, numB: 200 });
      expect(store.getComputed()).toStrictEqual({ isEnough: 'enough', numAB: 250 });
    });
  });
});
