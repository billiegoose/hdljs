import { Gate } from '../Gate.js'
import { Mux } from './index.js'
import { repeat } from '../utils.js'

export class Mux16 extends Gate {
  constructor() {
    super()
    repeat.call(this, Mux, 16)
    // The call to `repeat` created a 16bit sel bus, but we want a 1bit sel pin
    // so.... we just join all the wires together and call attach on one of them
    // to overwrite the original bus property
    for (const pin of this.sel) {
      pin.wire(this.sel[0])
    }
    this.sel[0].attach(this, 'sel')
  }
}
