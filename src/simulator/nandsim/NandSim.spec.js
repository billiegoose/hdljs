import { Logic } from "./Logic.js";
import { NandSim } from "./NandSim.js";

describe("NandSim", () => {
  describe("Adder", () => {
    // Define Inputs
    let sim = new NandSim();
    let a = sim.addPin();
    let b = sim.addPin();
    let cin = sim.addPin();
    sim.defineInput(a);
    sim.defineInput(b);
    sim.defineInput(cin);
    sim.namePin(a, "A");
    sim.namePin(b, "B");
    sim.namePin(cin, "C");

    // Define Outputs
    let sum = sim.addPin();
    let carry = sim.addPin();
    sim.defineOutput(sum);
    sim.defineOutput(carry);
    sim.namePin(sum, "sum");
    sim.namePin(carry, "carry");

    // Define internal junctions
    let i0 = sim.addPin();
    let i1 = sim.addPin();
    let i2 = sim.addPin();
    let hs = sim.addPin();
    let j0 = sim.addPin();
    let j1 = sim.addPin();
    let j2 = sim.addPin();

    // Define connections
    sim.addNand(a, b, i0);
    sim.addNand(a, i0, i1);
    sim.addNand(b, i0, i2);
    sim.addNand(i1, i2, hs);
    sim.addNand(hs, cin, j0);
    sim.addNand(hs, j0, j1);
    sim.addNand(cin, j0, j2);
    sim.addNand(j1, j2, sum);
    sim.addNand(i0, j0, carry);

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

  describe("DFF Shifter", () => {
    // Define Inputs & Outputs
    let sim = new NandSim()
    let a = sim.addPin()
    let b = sim.addPin()
    let c = sim.addPin()
    let d = sim.addPin()
    let e = sim.addPin()
    sim.namePin(a, 'a')
    sim.namePin(b, 'b')
    sim.namePin(c, 'c')
    sim.namePin(d, 'd')
    sim.namePin(e, 'e')
    sim.defineInput(a)
    sim.defineOutput(e)
    
    // Define connections
    sim.addDFF(a, b)
    sim.addDFF(b, c)
    sim.addDFF(c, d)
    sim.addDFF(d, e)

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
