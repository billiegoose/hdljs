import { Dmux } from "./Dmux.js";
import { sim } from "../Gate.js";

describe("Dmux", () => {
  // Define connections
  let dmux = new Dmux();

  // Define Inputs
  dmux.sel.name("sel").input();
  dmux.in.name("input").input();

  // Define Outputs
  dmux.a.name("a").output();
  dmux.b.name("b").output();

  test.each`
    input  | sel    | a      | b
    ${"0"} | ${"0"} | ${"0"} | ${"0"}
    ${"0"} | ${"1"} | ${"0"} | ${"0"}
    ${"1"} | ${"0"} | ${"1"} | ${"0"}
    ${"1"} | ${"1"} | ${"0"} | ${"1"}
    ${"0"} | ${"?"} | ${"0"} | ${"0"}
    ${"1"} | ${"?"} | ${"?"} | ${"?"}
    ${"?"} | ${"0"} | ${"?"} | ${"0"}
    ${"?"} | ${"1"} | ${"0"} | ${"?"}
  `("[$a, $b][$sel] == out", ({ input, sel, a, b }) => {
    sim.setPins({ input, sel });
    expect(sim.readInputs()).toEqual({ input, sel });
    expect(sim.evalOutputs()).toEqual({ a, b });
  });
});
