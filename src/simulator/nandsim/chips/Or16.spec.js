import { Or16 } from "./index.js";
import { sim } from "../Gate.js";

describe("Or16", () => {
  // Define connections
  let or = new Or16();

  // Define Inputs
  or.a.name("a").input();
  or.b.name("b").input();

  // Define Outputs
  or.out.name("out").output();

  test.each`
    a | b                 | out
    ${'0000000000000000'} | ${'0000000000000000'} | ${'0000000000000000'}
    ${'0000000000000000'} | ${'1111111111111111'} | ${'1111111111111111'}
    ${'1111111111111111'} | ${'1111111111111111'} | ${'1111111111111111'}
    ${'1010101010101010'} | ${'0101010101010101'} | ${'1111111111111111'}
    ${'0011110011000011'} | ${'0000111111110000'} | ${'0011111111110011'}
    ${'0001001000110100'} | ${'1001100001110110'} | ${'1001101001110110'}
  `("$a | $b == $out", ({ a, b, out }) => {
    sim.setPins({ a, b });
    expect(sim.readPins('a', 'b')).toEqual({ a, b });
    sim.evalOutputs()
    expect(sim.readPins('out')).toEqual({ out });
  });
});
