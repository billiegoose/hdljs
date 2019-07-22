import { FullAdder } from "./index.js";
import { sim } from "../Gate.js";

describe("FullAdder", () => {
  // Define connections
  let gate = new FullAdder();

  // Define Inputs
  gate.a.name("a").input();
  gate.b.name("b").input();
  gate.c.name("c").input();

  // Define Outputs
  gate.sum.name("sum").output();
  gate.carry.name("carry").output();

  test.each`
    a      | b      | c      | sum    | carry
    ${"0"} | ${"0"} | ${"0"} | ${"0"} | ${"0"}
    ${"0"} | ${"0"} | ${"1"} | ${"1"} | ${"0"}
    ${"0"} | ${"1"} | ${"0"} | ${"1"} | ${"0"}
    ${"0"} | ${"1"} | ${"1"} | ${"0"} | ${"1"}
    ${"1"} | ${"0"} | ${"0"} | ${"1"} | ${"0"}
    ${"1"} | ${"0"} | ${"1"} | ${"0"} | ${"1"}
    ${"1"} | ${"1"} | ${"0"} | ${"0"} | ${"1"}
    ${"1"} | ${"1"} | ${"1"} | ${"1"} | ${"1"}
  `("$a + $b + $c == $sum sum, $carry carry", ({ a, b, c, sum, carry }) => {
    sim.setPins({ a, b, c });
    expect(sim.readPins("a", "b", "c")).toEqual({ a, b, c });
    sim.evalOutputs();
    expect(sim.readPins("sum", "carry")).toEqual({ sum, carry });
  });
});
