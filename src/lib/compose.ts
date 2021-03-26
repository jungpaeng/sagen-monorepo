export function compose(...fns: Function[]) {
  return function (p: any) {
    return fns.reduceRight((prev, curr) => curr(prev), p);
  };
}
