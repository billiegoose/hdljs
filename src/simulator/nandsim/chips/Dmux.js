import { Gate } from '../Gate.js'
import { And, Not } from './index.js'

export class Dmux extends Gate {
  constructor() {
    super()

    const not = new Not()
    const andA = new And()
    const andB = new And()

    not.in.attach(this, 'sel')

    andA.a.attach(this, 'in')
    andA.b = not.out
    andA.out.attach(this, 'a')

    andB.a = andA.a
    andB.b = not.in
    andB.out.attach(this, 'b')
  }
}
