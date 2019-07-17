import { Gate, Bus } from '../Gate.js'
import { Or, Or8Way } from './index.js'

export class Or16Way extends Gate {
  constructor() {
    super()
    const or1 = new Or8Way()
    const or2 = new Or8Way()
    const combine = new Or()

    const busIn = new Bus(
      ...or1.in,
      ...or2.in
    )
    busIn.attach(this, 'in')

    combine.a = or1.out
    combine.b = or2.out
    combine.out.attach(this, 'out')
  }
}
