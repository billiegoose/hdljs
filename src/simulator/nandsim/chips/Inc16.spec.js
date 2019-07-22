import { Inc16 } from "./index.js";
import { sim } from "../Gate.js";

describe("Inc16", () => {
  // Define connections
  let gate = new Inc16();

  // Define Inputs
  gate.in.name("input").input();

  // Define Outputs
  gate.out.name("out").output();
  gate.overflow.name("overflow").output();

  test.each`
    input                 | out
    ${"0000000000000000"} | ${"0000000000000001"}
    ${"1111111111111111"} | ${"0000000000000000"}
    ${"0000000000000101"} | ${"0000000000000110"}
    ${"1111111111111011"} | ${"1111111111111100"}
  `("$input + 1 == $out", ({ input, out }) => {
    sim.setPins({ input });
    expect(sim.readPins("input")).toEqual({ input });
    sim.evalOutputs();
    expect(sim.readPins("out")).toEqual({ out });
  });
});
