import { Gate } from '../Gate.js'
import { Nand, Not } from './index.js'

export class Or extends Gate {
  constructor() {
    super()

    const n1 = new Not()
    const n2 = new Not()
    const nand = new Nand()
    n1.out = nand.a
    n2.out = nand.b

    n1.in.attach(this, 'a')
    n2.in.attach(this, 'b')
    nand.out.attach(this, 'out')
  }
}
