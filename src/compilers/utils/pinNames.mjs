import { flatten } from './flatten.mjs'
import { range } from './range.mjs'

export function pinNames (pinMap) {
  return flatten([...pinMap.values()]
    .map(pin => range(pin.width).map(i => pin.name + i))
  )
}