function range (width) {
  const vals = [];
  for (let i = 2 ** width - 1; i >= 0; i--) {
    vals.push(i);
  }
  return vals;
}

export function combinations (widths, fn) {
  const sets = [];
  for (let width of widths) {
    sets.push(range(width));
  }
  let indexes = sets.map(set => set.length - 1);
  let metaIndex = sets.length - 2;
  let failsafe = 100
  while (failsafe--) {
    for (let i = sets[metaIndex + 1].length - 1; i >= 0; i--) {
      indexes[metaIndex + 1] = i;
      fn(sets.map((set, i) => set[indexes[i]]));
    }
    // slide metaIndex to the left
    while(metaIndex > -1 && indexes[metaIndex] === 0) metaIndex--;
    if (metaIndex === -1) break;
    // reset counters
    for (let i = metaIndex + 1; i < sets.length; i++) {
      indexes[i] = sets[i].length - 1;
    }
    indexes[metaIndex]--
    // slide metaIndex to the right
    metaIndex = sets.length - 2;
  }
}