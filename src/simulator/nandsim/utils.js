import { Bus, } from './Gate.js'

export function repeat(gate, n) {
  const gates = new Array(n).fill(0).map(() => new gate())
  const buses = {}
  for (let key of gates[0]._ports) {
    let port = gates[0][key];
    if (port instanceof Bus) {
      const _buses = []
      for (let i of port._ports) {
        const bus = new Bus(
          ...gates.map(gate => gate[key][i])
        )
        _buses[i] = bus
      }
      const bus = new Bus(..._buses)
      buses[key] = bus
      bus.attach(this, key)
    } else {
      const bus = new Bus(
        ...gates.map(gate => gate[key])
      )
      buses[key] = bus
      bus.attach(this, key)
    } 
  }
}
