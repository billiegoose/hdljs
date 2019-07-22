import { Gate } from '../Gate.js'
import { And, Xor } from './index.js'

export class HalfAdder extends Gate {
  constructor() {
    super()

    const and = new And()
    const xor = new Xor()

    xor.a = and.a
    xor.b = and.b
    xor.a.attach(this, 'a')
    xor.b.attach(this, 'b')
    xor.out.attach(this, 'sum')
    and.out.attach(this, 'carry')
  }
}
