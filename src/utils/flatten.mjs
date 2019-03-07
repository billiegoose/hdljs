export const flatten = (arr) => {
  let flat = []
  for (const a of arr) {
    for (const el of a) {
      flat.push(el)
    }
  }
  return flat
}
