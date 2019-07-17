import { Gate } from '../Gate.js'
import { DFF, Mux } from './index.js'

export class Bit extends Gate {
  constructor() {
    super()

    const mux = new Mux()
    const dff = new DFF()

    mux.a = dff.out
    dff.in = mux.out
    mux.b.attach(this, 'in')
    mux.sel.attach(this, 'load')
    dff.out.attach(this, 'out')
  }
}
