export function rangePow2 (width) {
  const vals = [];
  for (let i = 2 ** width - 1; i >= 0; i--) {
    vals.push(i);
  }
  return vals;
}