import { Bus, Gate } from '../Gate.js'
import { Mux16 } from './index.js'

export class Mux4Way16 extends Gate {
  constructor() {
    super()

    const layer1H = new Mux16()
    const layer1L = new Mux16()
    const layer2 = new Mux16()

    const sel = new Bus(layer2.sel, layer1H.sel)
    layer1H.sel = layer1L.sel
    sel.attach(this, 'sel')

    const bus = new Bus(...layer1H.in, ...layer1L.in)
    bus.attach(this, 'in')
    
    layer1H.out = layer2.in[0]
    layer1L.out = layer2.in[1]

    layer2.out.attach(this, 'out')
  }
}
