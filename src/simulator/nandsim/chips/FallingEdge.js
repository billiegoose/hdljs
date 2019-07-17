import { Gate } from '../Gate.js'
import { And, DFF, Not } from './index.js'

export class FallingEdge extends Gate {
  constructor() {
    super()

    const not = new Not()
    const and = new And()
    const dff = new DFF()

    dff.in.attach(this, 'in')
    not.in = dff.in
    and.a = not.out
    and.b = dff.out
    and.out.attach(this, 'out')
  }
}
