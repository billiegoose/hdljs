import { Gate, Bus } from '../Gate.js'
import { Or } from './index.js'

export class Or16 extends Gate {
  constructor() {
    super()
    const or0 = new Or()
    const or1 = new Or()
    const or2 = new Or()
    const or3 = new Or()
    const or4 = new Or()
    const or5 = new Or()
    const or6 = new Or()
    const or7 = new Or()
    const or8 = new Or()
    const or9 = new Or()
    const or10 = new Or()
    const or11 = new Or()
    const or12 = new Or()
    const or13 = new Or()
    const or14 = new Or()
    const or15 = new Or()

    const busA = new Bus(
      or0.a,
      or1.a,
      or2.a,
      or3.a,
      or4.a,
      or5.a,
      or6.a,
      or7.a,
      or8.a,
      or9.a,
      or10.a,
      or11.a,
      or12.a,
      or13.a,
      or14.a,
      or15.a
    )
    const busB = new Bus(
      or0.b,
      or1.b,
      or2.b,
      or3.b,
      or4.b,
      or5.b,
      or6.b,
      or7.b,
      or8.b,
      or9.b,
      or10.b,
      or11.b,
      or12.b,
      or13.b,
      or14.b,
      or15.b
    )

    const busOut = new Bus(
      or0.out,
      or1.out,
      or2.out,
      or3.out,
      or4.out,
      or5.out,
      or6.out,
      or7.out,
      or8.out,
      or9.out,
      or10.out,
      or11.out,
      or12.out,
      or13.out,
      or14.out,
      or15.out
    )

    busA.attach(this, 'a')
    busB.attach(this, 'b')
    busOut.attach(this, 'out')
  }
}
