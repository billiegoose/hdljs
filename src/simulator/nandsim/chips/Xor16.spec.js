import { Xor16 } from "./index.js";
import { sim } from "../Gate.js";

describe("Xor16", () => {
  // Define connections
  let xor = new Xor16();

  // Define Inputs
  xor.a.name("a").input();
  xor.b.name("b").input();

  // Define Outputs
  xor.out.name("out").output();

  test.each`
    a                     | b                     | out
    ${"0000000000000000"} | ${"0000000000000000"} | ${"0000000000000000"}
    ${"0000000000000000"} | ${"1111111111111111"} | ${"1111111111111111"}
    ${"1111111111111111"} | ${"1111111111111111"} | ${"0000000000000000"}
    ${"1010101010101010"} | ${"0101010101010101"} | ${"1111111111111111"}
    ${"0011110011000011"} | ${"0000111111110000"} | ${"0011001100110011"}
    ${"0001001000110100"} | ${"1001100001110110"} | ${"1000101001000010"}
  `("$a ⊕ $b == $out", ({ a, b, out }) => {
    sim.setPins({ a, b });
    expect(sim.readPins("a", "b")).toEqual({ a, b });
    sim.evalOutputs();
    expect(sim.readPins("out")).toEqual({ out });
  });
});
