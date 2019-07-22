import { Bus, Gate } from '../Gate.js'
import { FullAdder, HalfAdder } from './index.js'

export class Add16 extends Gate {
  constructor() {
    super()
    const gates = []
    for (let i = 1; i <= 15; i++) {
      gates.push(new FullAdder())
    }
    gates.push(new HalfAdder())

    const a = new Bus(...gates.map(gate => gate.a))
    const b = new Bus(...gates.map(gate => gate.b))
    const out = new Bus(...gates.map(gate => gate.sum))
    a.attach(this, 'a')
    b.attach(this, 'b')
    out.attach(this, 'out')

    for (let i = 0; i < 15; i++) {
      gates[i].c = gates[i + 1].carry
    }
    gates[0].carry.attach(this, 'overflow')
  }
}
