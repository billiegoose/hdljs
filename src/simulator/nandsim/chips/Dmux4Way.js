import { Bus, Gate } from '../Gate.js'
import { Dmux } from './index.js'

export class Dmux4Way extends Gate {
  constructor() {
    super()

    const layer1 = new Dmux()
    const layer2a = new Dmux()
    const layer2b = new Dmux()

    const sel = new Bus(layer1.sel, layer2a.sel)
    layer2a.sel = layer2b.sel
    sel.attach(this, 'sel')

    layer1.in.attach(this, 'in')
    
    layer1.a = layer2a.in
    layer1.b = layer2b.in

    const out = new Bus(layer2b.b, layer2b.a, layer2a.b, layer2a.a)
    out.attach(this, 'out')
  }
}
