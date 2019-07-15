import { Not16 } from "./index.js";
import { sim } from "../Gate.js";
import { Logic } from "../Logic.js";

describe("Not16", () => {
  // Define connections
  let n = new Not16();

  // Define Inputs
  n.in.name("input");
  [...n.in].map(pin => pin.input());

  // Define Outputs
  n.out.name("out");
  [...n.out].map(pin => pin.output());

  test.each`
    input                 | out
    ${"0000000000000000"} | ${"1111111111111111"}
    ${"1111111111111111"} | ${"0000000000000000"}
    ${"1010101010101010"} | ${"0101010101010101"}
    ${"0011110011000011"} | ${"1100001100111100"}
    ${"0001001000110100"} | ${"1110110111001011"}
  `("~$input == $out", ({ input, out }) => {
    let pins = {}
    for (let i = 0; i < input.length; i++) {
      pins[`input[${i}]`] = input[i]
    }
    sim.setPins(pins);
    expect(sim.readInputs()).toEqual(pins);
    pins = {}
    for (let i = 0; i < out.length; i++) {
      pins[`out[${i}]`] = out[i]
    }
    expect(sim.evalOutputs()).toEqual(pins);
  });
});
