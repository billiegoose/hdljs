import { Gate } from '../Gate.js'
import { HalfAdder, Or } from './index.js'

export class FullAdder extends Gate {
  constructor() {
    super()

    const h1 = new HalfAdder()
    const h2 = new HalfAdder()
    const or = new Or()

    h1.a.attach(this, 'a')
    h1.b.attach(this, 'b')
    h1.sum = h2.a
    h2.b.attach(this, 'c')
    h2.sum.attach(this, 'sum')
    or.a = h1.carry
    or.b = h2.carry
    or.out.attach(this, 'carry')
  }
}
