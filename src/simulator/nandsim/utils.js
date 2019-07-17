import { Bus } from './Gate.js'

export function repeat(gate, n) {
  const gates = new Array(n).fill(0).map(() => new gate())
  const buses = {}
  for (let key in gates[0]) {
    const bus = new Bus(
      ...gates.map(gate => gate[key])
    )
    buses[key] = bus
    bus.attach(this, key)
  }
}
