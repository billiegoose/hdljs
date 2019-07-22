import { HalfAdder } from "./index.js";
import { sim } from "../Gate.js";

describe("HalfAdder", () => {
  // Define connections
  let gate = new HalfAdder();

  // Define Inputs
  gate.a.name("a").input();
  gate.b.name("b").input();

  // Define Outputs
  gate.sum.name("sum").output();
  gate.carry.name("carry").output();

  test.each`
    a      | b      | sum    | carry
    ${"0"} | ${"0"} | ${"0"} | ${"0"}
    ${"0"} | ${"1"} | ${"1"} | ${"0"}
    ${"1"} | ${"0"} | ${"1"} | ${"0"}
    ${"1"} | ${"1"} | ${"0"} | ${"1"}
  `("$a + $b == $sum sum, $carry carry", ({ a, b, sum, carry }) => {
    sim.setPins({ a, b });
    expect(sim.readPins("a", "b")).toEqual({ a, b });
    sim.evalOutputs();
    expect(sim.readPins("sum", "carry")).toEqual({ sum, carry });
  });
});
