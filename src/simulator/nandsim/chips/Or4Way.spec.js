import { Or4Way } from "./index.js";
import { sim } from "../Gate.js";

describe("Or4Way", () => {
  // Define connections
  let or = new Or4Way();

  // Define Inputs
  or.in.name("input").input();

  // Define Outputs
  or.out.name("out").output();

  test.each`
    input     | out
    ${"0000"} | ${"0"}
    ${"1111"} | ${"1"}
    ${"1010"} | ${"1"}
    ${"0011"} | ${"1"}
    ${"0001"} | ${"1"}
    ${"000?"} | ${"?"}
  `("or $input == $out", ({ input, out }) => {
    sim.setPins({ input });
    expect(sim.readPins("input")).toEqual({ input });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
