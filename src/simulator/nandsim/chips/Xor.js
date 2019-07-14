import { Gate } from '../Gate.js'
import { Nand } from './index.js'

export class Xor extends Gate {
  constructor() {
    super()

    const n1 = new Nand()
    const n2 = new Nand()
    const n3 = new Nand()
    const n4 = new Nand()
    n1.a.attach(this, 'a')
    n1.b.attach(this, 'b')
    n1.out = n3.a
    n3.b = n1.b
    n2.a = n1.a
    n2.b = n1.out
    n2.out = n4.a
    n3.out = n4.b
    n4.out.attach(this, 'out')
  }
}
