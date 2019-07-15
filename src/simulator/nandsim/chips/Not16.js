import { Gate, Bus } from '../Gate.js'
import { Not } from './index.js'

export class Not16 extends Gate {
  constructor() {
    super()
    const not0 = new Not()
    const not1 = new Not()
    const not2 = new Not()
    const not3 = new Not()
    const not4 = new Not()
    const not5 = new Not()
    const not6 = new Not()
    const not7 = new Not()
    const not8 = new Not()
    const not9 = new Not()
    const not10 = new Not()
    const not11 = new Not()
    const not12 = new Not()
    const not13 = new Not()
    const not14 = new Not()
    const not15 = new Not()

    const busIn = new Bus(
      not0.in,
      not1.in,
      not2.in,
      not3.in,
      not4.in,
      not5.in,
      not6.in,
      not7.in,
      not8.in,
      not9.in,
      not10.in,
      not11.in,
      not12.in,
      not13.in,
      not14.in,
      not15.in
    )

    const busOut = new Bus(
      not0.out,
      not1.out,
      not2.out,
      not3.out,
      not4.out,
      not5.out,
      not6.out,
      not7.out,
      not8.out,
      not9.out,
      not10.out,
      not11.out,
      not12.out,
      not13.out,
      not14.out,
      not15.out
    )

    busIn.attach(this, 'in')
    busOut.attach(this, 'out')
  }
}
