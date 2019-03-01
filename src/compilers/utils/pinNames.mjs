import { flatten } from './flatten.mjs'
import { range } from './range.mjs'

export function pinNames (pinMap, {group = false} = {}) {
  let names = [...pinMap.values()].map(pin => range(pin.width).map(i => pin.name + i));
  return group ? names : flatten(names);
}