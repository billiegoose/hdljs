import { Gate } from '../Gate.js'
import { Nand, Not } from './index.js'

export class Mux extends Gate {
  constructor() {
    super()

    const not = new Not()
    const n1 = new Nand()
    const n2 = new Nand()
    const n3 = new Nand()

    not.in.attach(this, 'sel')

    n1.a = not.out
    n1.b.attach(this, 'a')
    n2.a = not.in
    n2.b.attach(this, 'b')

    n3.a = n1.out
    n3.b = n2.out
    n3.out.attach(this, 'out')
  }
}
