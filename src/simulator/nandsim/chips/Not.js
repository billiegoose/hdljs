import { Gate, InputPin, OutputPin } from '../Gate.js'
import { Nand } from '../Nand.js'

export class Not extends Gate {
  constructor() {
    super()
    this._in = new InputPin(this, 'in')
    this._out = new OutputPin(this, 'out')

    const nand = new Nand()
    nand.a = nand.b
    this.in = nand.a
    this.out = nand.out
  }
}
