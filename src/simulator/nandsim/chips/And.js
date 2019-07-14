import { Gate } from '../Gate.js'
import { Nand } from '../Nand.js'
import { Not } from './Not.js'

export class And extends Gate {
  constructor() {
    super()

    const nand = new Nand()
    const not = new Not()
    not.in = nand.out

    nand.a.attach(this, 'a')
    nand.b.attach(this, 'b')
    not.out.attach(this, 'out')
  }
}
