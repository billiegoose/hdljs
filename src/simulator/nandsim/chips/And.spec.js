import { And } from "./And.js";
import { sim } from "../Gate.js";
import { Logic } from "../Logic.js";

describe("And", () => {
  // Define connections
  let and = new And();

  // Define Inputs
  and.a.name("a").input();
  and.b.name("b").input();

  // Define Outputs
  and.out.name("out").output();

  test.each`
    a           | b           | out
    ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
    ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
    ${Logic.HI} | ${Logic.LO} | ${Logic.LO}
    ${Logic.HI} | ${Logic.HI} | ${Logic.HI}
  `("$a ^ $b == $out", ({ a, b, out }) => {
    sim.setPins({ a, b });
    expect(sim.readInputs()).toEqual({ a, b });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
