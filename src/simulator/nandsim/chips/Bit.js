import { Gate } from '../Gate.js'
import { DFF, Mux } from './index.js'

export class Bit extends Gate {
  constructor() {
    super()

    const mux = new Mux()
    const dff = new DFF()

    dff.out = mux.in[0]
    dff.in = mux.out
    mux.in[1].attach(this, 'in')
    mux.sel.attach(this, 'load')
    dff.out.attach(this, 'out')
  }
}
