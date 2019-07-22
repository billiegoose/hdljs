import { hi, lo, Gate, Bus } from '../Gate.js'
import { Add16 } from './index.js'

export class Inc16 extends Gate {
  constructor() {
    super()

    const add = new Add16()
    const one = new Bus(lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, hi)

    add.b = one
    add.a.attach(this, 'in')
    add.out.attach(this, 'out')
    add.overflow.attach(this, 'overflow')
  }
}
