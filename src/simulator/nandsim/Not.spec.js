import { Not } from "./chips/Not.js";
import { sim } from "./Gate.js";
import { Logic } from "./Logic.js";

describe("Not", () => {
  // Define connections
  let n = new Not();

  // Define Inputs
  n.in.name("input").input();

  // Define Outputs
  n.out.name("out").output();

  test.each`
    input       | out
    ${Logic.LO} | ${Logic.HI}
    ${Logic.HI} | ${Logic.LO}
    ${Logic.UK} | ${Logic.UK}
  `("~$input == $out", ({ input, out }) => {
    sim.setPins({ input });
    expect(sim.readInputs()).toEqual({ input });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
