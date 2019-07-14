import { Gate, InputPin, OutputPin, sim } from './Gate.js'

export class Nand extends Gate {
  constructor() {
    super();
    const a = new InputPin()
    a.attach(this, 'a')
    const b = new InputPin()
    b.attach(this, 'b')
    const out = new OutputPin()
    out.attach(this, 'out')
  }
  finalizer () {
    sim.addNand(this.a.value, this.b.value, this.out.value)
  }
}
