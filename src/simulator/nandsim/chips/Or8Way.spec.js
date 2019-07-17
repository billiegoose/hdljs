import { Or8Way } from "./index.js";
import { sim } from "../Gate.js";

describe("Or8Way", () => {
  // Define connections
  let or = new Or8Way();

  // Define Inputs
  or.in.name("input").input();

  // Define Outputs
  or.out.name("out").output();

  test.each`
    input     | out
    ${"00000000"} | ${"0"}
    ${"11111111"} | ${"1"}
    ${"00010000"} | ${"1"}
    ${"00000001"} | ${"1"}
    ${"00100110"} | ${"1"}
    ${"000000?0"} | ${"?"}
    ${"00?00000"} | ${"?"}
  `("or $input == $out", ({ input, out }) => {
    sim.setPins({ input });
    expect(sim.readPins("input")).toEqual({ input });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
