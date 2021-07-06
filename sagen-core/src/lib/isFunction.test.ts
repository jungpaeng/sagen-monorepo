import { isFunction } from './isFunction';

describe('Lib', () => {
  describe('isFunction', () => {
    it('return true if passed function', () => {
      expect(isFunction(() => 3)).toBe(true);
    });

    it('return false if not passed function', () => {
      expect(isFunction(0)).toBe(false);
      expect(isFunction('')).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
    });
  });
});
