export const flatten = (arr) => arr.map(x => x.join(',')).join(',').split(',')
