import { sim } from './Gate.js'
import { DFF } from './DFF.js'
import { Logic } from './Logic.js'

describe("DFF", () => {
  describe("DFF Shifter", () => {
    // Define connections
    let d1 = new DFF()
    let d2 = new DFF()
    let d3 = new DFF()
    let d4 = new DFF()

    d1.out = d2.in
    d2.out = d3.in
    d3.out = d4.in

    // Define Inputs
    d1.in.name('a').input()

    // Define Inspectable Junctions
    d1.out.name('b')
    d2.out.name('c')
    d3.out.name('d')

    // Define Outputs
    d4.out.name('e').output()

    test.each`
      a           | b           | c           | d           | e
      ${Logic.LO} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
      ${Logic.HI} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
      ${Logic.LO} | ${Logic.HI} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
      ${Logic.HI} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO} | ${Logic.LO}
      ${Logic.LO} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
      ${Logic.HI} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI}
      ${Logic.UK} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
      ${Logic.UK} | ${Logic.UK} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI}
      ${Logic.UK} | ${Logic.UK} | ${Logic.UK} | ${Logic.HI} | ${Logic.LO}
      ${Logic.UK} | ${Logic.UK} | ${Logic.UK} | ${Logic.UK} | ${Logic.HI}
      ${Logic.UK} | ${Logic.UK} | ${Logic.UK} | ${Logic.UK} | ${Logic.UK}
    `("$a $b $c $d $e", ({ a, b, c, d, e }) => {
      sim.setPins({ a });
      sim.evalOutputs();
      expect(sim.readPins('a', 'b', 'c', 'd', 'e')).toEqual({ a, b, c, d, e });
      sim.clock();
    });
  });
});
