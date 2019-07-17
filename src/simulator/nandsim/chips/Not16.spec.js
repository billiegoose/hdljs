import { Not16 } from "./index.js";
import { sim } from "../Gate.js";

describe("Not16", () => {
  // Define connections
  let n = new Not16();

  // Define Inputs
  n.in.name("input").input();

  // Define Outputs
  n.out.name("out").output();

  test.each`
    input                 | out
    ${"0000000000000000"} | ${"1111111111111111"}
    ${"1111111111111111"} | ${"0000000000000000"}
    ${"1010101010101010"} | ${"0101010101010101"}
    ${"0011110011000011"} | ${"1100001100111100"}
    ${"0001001000110100"} | ${"1110110111001011"}
  `("~$input == $out", ({ input, out }) => {
    sim.setPins({ input });
    expect(sim.readPins('input')).toEqual({ input });
    sim.evalOutputs()
    expect(sim.readPins('out')).toEqual({ out });
  });
});
