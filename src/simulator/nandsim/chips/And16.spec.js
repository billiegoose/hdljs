import { And16 } from "./index.js";
import { sim } from "../Gate.js";

describe("And16", () => {
  // Define connections
  let and = new And16();

  // Define Inputs
  and.a.name("a").input();
  and.b.name("b").input();

  // Define Outputs
  and.out.name("out").output();

  test.each`
    a                     | b                     | out
    ${"0000000000000000"} | ${"0000000000000000"} | ${"0000000000000000"}
    ${"0000000000000000"} | ${"1111111111111111"} | ${"0000000000000000"}
    ${"1111111111111111"} | ${"1111111111111111"} | ${"1111111111111111"}
    ${"1010101010101010"} | ${"0101010101010101"} | ${"0000000000000000"}
    ${"0011110011000011"} | ${"0000111111110000"} | ${"0000110011000000"}
    ${"0001001000110100"} | ${"1001100001110110"} | ${"0001000000110100"}
  `("$a ∧ $b == $out", ({ a, b, out }) => {
    sim.setPins({ a, b });
    expect(sim.readPins("a", "b")).toEqual({ a, b });
    sim.evalOutputs();
    expect(sim.readPins("out")).toEqual({ out });
  });
});
