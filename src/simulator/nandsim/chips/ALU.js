import { Gate, Bus, lo } from '../Gate.js'
import { Add16, And16, Mux16, Not, Not16, Or, Or16Way } from './index.js'

export class ALU extends Gate {
  constructor() {
    super()

    const zero16 = new Bus(lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo, lo)

    // Transform input
    const xzero = new Mux16()
    xzero.sel.attach(this, 'zx')
    xzero.in[0].wire(...zero16)
    xzero.in[1].attach(this, 'x')
    const xzeroinv = new Not16()
    xzeroinv.in = xzero.out
    const xnot = new Mux16()
    xnot.sel.attach(this, 'nx')
    xnot.in[0].wire(...xzeroinv.out)
    xnot.in[1].wire(...xzero.out)

    const yzero = new Mux16()
    yzero.sel.attach(this, 'zy')
    yzero.in[0].wire(...zero16)
    yzero.in[1].attach(this, 'y')
    const yzeroinv = new Not16()
    yzeroinv.in = yzero.out
    const ynot = new Mux16()
    ynot.sel.attach(this, 'ny')
    ynot.in[0].wire(...yzeroinv.out)
    ynot.in[1].wire(...yzero.out)

    // Computation

    const and = new And16()
    and.a = xnot.out
    and.b = ynot.out
    const add = new Add16()
    add.a = xnot.out
    add.b = ynot.out

    const muxOut = new Mux16()
    muxOut.sel.attach(this, 'f')
    muxOut.in[0].wire(...add.out)
    muxOut.in[1].wire(...and.out)

    // Transform output
    const notOut = new Not16()
    notOut.in = muxOut.out
    const muxOutNeg = new Mux16()
    muxOutNeg.sel.attach(this, 'no')
    muxOutNeg.in[0].wire(...notOut.out)
    muxOutNeg.in[1].wire(...muxOut.out)
    muxOutNeg.out.attach(this, 'out')

    // Compute zero flag
    const or16way = new Or16Way()
    or16way.in = muxOutNeg.out
    const invZ = new Not()
    invZ.in = or16way.out
    invZ.out.attach(this, 'zr')

    // Compute negative flag
    muxOutNeg.out[0].attach(this, 'ng')
  }
}
