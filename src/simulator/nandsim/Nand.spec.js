import { Nand, sim } from './Nand.js'
import { Logic } from './Logic.js'

describe("Nand", () => {
  describe("Adder", () => {
    // Define connections
    let n1 = new Nand()
    let n2 = new Nand()
    n2.a = n1.a
    n2.b = n1.out
    let n3 = new Nand()
    n3.a = n1.b
    n3.b = n2.b
    let n4 = new Nand()
    n4.a = n2.out
    n4.b = n3.out
    let n5 = new Nand()
    n5.a = n4.out
    let n6 = new Nand()
    n6.a = n4.out
    n6.b = n5.out
    let n7 = new Nand()
    n7.a = n5.b
    n7.b = n6.b
    let n8 = new Nand()
    n8.a = n6.out
    n8.b = n7.out
    let n9 = new Nand()
    n9.a = n1.out
    n9.b = n5.out

    // Define Inputs
    n1.a.name('A').input()
    n1.b.name('B').input()
    n5.b.name('C').input()

    // Define Outputs
    n8.out.name('sum').output()
    n9.out.name('carry').output()

    test.each`
      A           | B           | C           | carry       | sum
      ${Logic.LO} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
      ${Logic.LO} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI}
      ${Logic.LO} | ${Logic.HI} | ${Logic.LO} | ${Logic.LO} | ${Logic.HI}
      ${Logic.LO} | ${Logic.HI} | ${Logic.HI} | ${Logic.HI} | ${Logic.LO}
      ${Logic.HI} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO} | ${Logic.HI}
      ${Logic.HI} | ${Logic.LO} | ${Logic.HI} | ${Logic.HI} | ${Logic.LO}
      ${Logic.HI} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
      ${Logic.HI} | ${Logic.HI} | ${Logic.HI} | ${Logic.HI} | ${Logic.HI}
      ${Logic.UK} | ${Logic.UK} | ${Logic.UK} | ${Logic.UK} | ${Logic.UK}
      ${Logic.LO} | ${Logic.HI} | ${Logic.UK} | ${Logic.UK} | ${Logic.UK}
      ${Logic.HI} | ${Logic.LO} | ${Logic.UK} | ${Logic.UK} | ${Logic.UK}
      ${Logic.LO} | ${Logic.LO} | ${Logic.UK} | ${Logic.LO} | ${Logic.UK}
      ${Logic.HI} | ${Logic.HI} | ${Logic.UK} | ${Logic.HI} | ${Logic.UK}
    `("$A + $B + $C = $carry$sum", ({ A, B, C, sum, carry }) => {
      sim.setPins({ A, B, C });
      expect(sim.readInputs()).toEqual({ A, B, C });
      expect(sim.evalOutputs()).toEqual({ sum, carry });
    });
  });
});
