import { Gate, InputPin, OutputPin, sim } from './Gate.js'

export class Nand extends Gate {
  constructor() {
    super();
    this._a = new InputPin(this, 'a')
    this._b = new InputPin(this, 'b')
    this._out = new OutputPin(this, 'out')
  }
  finalizer () {
    sim.addNand(this.a.value, this.b.value, this.out.value)
  }
}
