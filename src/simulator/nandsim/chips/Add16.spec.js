import { Add16 } from "./index.js";
import { sim } from "../Gate.js";

describe("Add16", () => {
  // Define connections
  let gate = new Add16();

  // Define Inputs
  gate.a.name("a").input();
  gate.b.name("b").input();

  // Define Outputs
  gate.out.name("out").output();
  gate.overflow.name("overflow").output();

  test.each`
    a                     | b                     | out                   | overflow
    ${"0000000000000000"} | ${"0000000000000000"} | ${"0000000000000000"} | ${"0"}
    ${"0000000000000000"} | ${"1111111111111111"} | ${"1111111111111111"} | ${"0"}
    ${"1111111111111111"} | ${"1111111111111111"} | ${"1111111111111110"} | ${"1"}
    ${"1010101010101010"} | ${"0101010101010101"} | ${"1111111111111111"} | ${"0"}
    ${"0011110011000011"} | ${"0000111111110000"} | ${"0100110010110011"} | ${"0"}
    ${"0001001000110100"} | ${"1001100001110110"} | ${"1010101010101010"} | ${"0"}
  `("$a + $b == $out out, $overflow overflow", ({ a, b, out, overflow }) => {
    sim.setPins({ a, b });
    expect(sim.readPins("a", "b")).toEqual({ a, b });
    sim.evalOutputs();
    expect(sim.readPins("out", "overflow")).toEqual({ out, overflow });
  });
});
