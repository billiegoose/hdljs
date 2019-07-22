import { Mux } from "./index.js";
import { sim } from "../Gate.js";

describe("Mux", () => {
  // Define connections
  let mux = new Mux();

  // Define Inputs
  mux.in.name("input").input();
  mux.sel.name("sel").input();

  // Define Outputs
  mux.out.name("out").output();

  test.each`
    out    | sel    | input
    ${"0"} | ${"0"} | ${"00"}
    ${"0"} | ${"1"} | ${"00"}
    ${"1"} | ${"0"} | ${"01"}
    ${"1"} | ${"1"} | ${"10"}
    ${"0"} | ${"?"} | ${"00"}
    ${"?"} | ${"?"} | ${"??"}
    ${"?"} | ${"0"} | ${"0?"}
    ${"?"} | ${"1"} | ${"?0"}
  `("[$input][$sel] == $out", ({ input, sel, out }) => {
    sim.setPins({ input, sel });
    expect(sim.readPins("input", "sel")).toEqual({ input, sel });
    sim.evalOutputs();
    expect(sim.readPins("out")).toEqual({ out });
  });
});
