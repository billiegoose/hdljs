import { Gate } from '../Gate.js'
import { Nand } from './index.js'

export class Not extends Gate {
  constructor() {
    super()
    const nand = new Nand()
    nand.a = nand.b
    nand.a.attach(this, 'in')
    nand.out.attach(this, 'out')
  }
}
