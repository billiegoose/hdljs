import { Gate, InputPin, OutputPin, sim } from './Gate.js'

export class DFF extends Gate {
  constructor() {
    super();
    const input = new InputPin()
    input.attach(this, 'in')
    const out = new OutputPin()
    out.attach(this, 'out')
  }
  finalizer () {
    sim.addDFF(this.in.value, this.out.value)
  }
}
