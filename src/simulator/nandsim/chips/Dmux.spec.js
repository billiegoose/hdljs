import { Dmux } from "./Dmux.js";
import { sim } from "../Gate.js";

describe("Dmux", () => {
  // Define connections
  let dmux = new Dmux();

  // Define Inputs
  dmux.sel.name("sel").input();
  dmux.in.name("input").input();

  // Define Outputs
  dmux.out.name("out").output();

  test.each`
    input  | sel    | out
    ${"0"} | ${"0"} | ${"00"}
    ${"0"} | ${"1"} | ${"00"}
    ${"1"} | ${"0"} | ${"01"}
    ${"1"} | ${"1"} | ${"10"}
    ${"0"} | ${"?"} | ${"00"}
    ${"1"} | ${"?"} | ${"??"}
    ${"?"} | ${"0"} | ${"0?"}
    ${"?"} | ${"1"} | ${"?0"}
  `("[$a, $b][$sel] == $input", ({ input, sel, out }) => {
    sim.setPins({ input, sel });
    expect(sim.readPins("input", "sel")).toEqual({ input, sel });
    sim.evalOutputs();
    expect(sim.readPins("out")).toEqual({ out });
  });
});
