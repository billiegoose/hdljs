import { Or16Way } from "./index.js";
import { sim } from "../Gate.js";

describe("Or16Way", () => {
  // Define connections
  let or = new Or16Way();

  // Define Inputs
  or.in.name("input").input();

  // Define Outputs
  or.out.name("out").output();

  test.each`
    input     | out
    ${"0000000000000000"} | ${"0"}
    ${"1111111111111111"} | ${"1"}
    ${"0000000000010000"} | ${"1"}
    ${"0000000000000001"} | ${"1"}
    ${"1000000000000000"} | ${"1"}
    ${"0010011000100110"} | ${"1"}
    ${"00000000000000?0"} | ${"?"}
  `("or $input == $out", ({ input, out }) => {
    sim.setPins({ input });
    expect(sim.readPins("input")).toEqual({ input });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
