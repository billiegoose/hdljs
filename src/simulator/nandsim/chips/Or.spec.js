import { Or } from "./Or.js";
import { sim } from "../Gate.js";
import { Logic } from "../Logic.js";

describe("Or", () => {
  // Define connections
  let and = new Or();

  // Define Inputs
  and.a.name("a").input();
  and.b.name("b").input();

  // Define Outputs
  and.out.name("out").output();
  console.log(sim)
  test.each`
    a           | b           | out
    ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
    ${Logic.LO} | ${Logic.HI} | ${Logic.HI}
    ${Logic.HI} | ${Logic.LO} | ${Logic.HI}
    ${Logic.HI} | ${Logic.HI} | ${Logic.HI}
    ${Logic.UK} | ${Logic.HI} | ${Logic.HI}
    ${Logic.HI} | ${Logic.UK} | ${Logic.HI}
    ${Logic.LO} | ${Logic.UK} | ${Logic.UK}
    ${Logic.UK} | ${Logic.LO} | ${Logic.UK}
  `("$a | $b == $out", ({ a, b, out }) => {
    sim.setPins({ a, b });
    expect(sim.readInputs()).toEqual({ a, b });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
