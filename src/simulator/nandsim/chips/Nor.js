import { Gate } from '../Gate.js'
import { Or, Not } from './index.js'

export class Nor extends Gate {
  constructor() {
    super()

    const or = new Or()
    const not = new Not()
    or.out = not.in

    or.a.attach(this, 'a')
    or.b.attach(this, 'b')
    not.out.attach(this, 'out')
  }
}
