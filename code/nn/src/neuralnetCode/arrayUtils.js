export function range(start, end) {
  return Array.from(Array(end - start).keys()).map((v) => start + v);
}
