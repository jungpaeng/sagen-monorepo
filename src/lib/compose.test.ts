import { compose } from './compose';

describe('Lib', () => {
  describe('compose', () => {
    it('composes from right to left', () => {
      const double = (x: number) => x * 2;
      const square = (x: number) => x * x;

      expect(compose(square)(5)).toBe(25);
      expect(compose(square, double)(5)).toBe(100);
      expect(compose(double, square)(5)).toBe(50);
    });

    it('composes functions from right to left', () => {
      type ReturnStringFunction = (x: string) => string;
      type NextReturnStringFunction = (next: ReturnStringFunction) => ReturnStringFunction;

      const a: NextReturnStringFunction = (next) => (x) => next(x + 'a');
      const b: NextReturnStringFunction = (next) => (x) => next(x + 'b');
      const c: NextReturnStringFunction = (next) => (x) => next(x + 'c');
      const final: ReturnStringFunction = (x) => x;

      expect(compose(a, b, c)(final)('')).toBe('abc');
      expect(compose(b, c, a)(final)('')).toBe('bca');
      expect(compose(c, a, b)(final)('')).toBe('cab');
    });

    it('throws at runtime if argument is not a function', () => {
      type sFunc = (x: number, y: number) => number;
      const square = (x: number, _: number) => x * x;
      const add = (x: number, y: number) => x + y;

      expect(() => compose(square, add, (false as unknown) as sFunc)(1, 2)).toThrow();
      expect(() => compose(square, add, (undefined as unknown) as Function)(1, 2)).toThrow();
      expect(() => compose(square, add, (true as unknown) as sFunc)(1, 2)).toThrow();
      expect(() => compose(square, add, (NaN as unknown) as sFunc)(1, 2)).toThrow();
      expect(() => compose(square, add, ('42' as unknown) as sFunc)(1, 2)).toThrow();
    });

    it('can be seeded with multiple arguments', () => {
      const square = (x: number, _: number) => x * x;
      const add = (x: number, y: number) => x + y;
      expect(compose(square, add)(1, 2)).toBe(9);
    });

    it('returns the first given argument if given no functions', () => {
      expect(compose()(1, 2)).toBe(1);
      expect(compose()(3)).toBe(3);
      expect(compose()(undefined)).toBe(undefined);
    });

    it('returns the first function if given only one', () => {
      const fn = () => {};

      expect(compose(fn)).toBe(fn);
    });
  });
});
