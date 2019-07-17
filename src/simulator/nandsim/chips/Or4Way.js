import { Gate, Bus } from '../Gate.js'
import { Or } from './index.js'

export class Or4Way extends Gate {
  constructor() {
    super()
    const or1 = new Or()
    const or2 = new Or()
    const combine = new Or()

    const busIn = new Bus(
      or1.a,
      or1.b,
      or2.a,
      or2.b
    )
    busIn.attach(this, 'in')

    combine.a = or1.out
    combine.b = or2.out
    combine.out.attach(this, 'out')
  }
}
