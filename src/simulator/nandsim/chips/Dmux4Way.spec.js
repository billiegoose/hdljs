import { Dmux4Way } from "./index.js";
import { sim } from "../Gate.js";

describe("Dmux4Way", () => {
  // Define connections
  let dmux = new Dmux4Way();

  // Define Inputs
  dmux.in.name("input").input();
  dmux.sel.name("sel").input();

  // Define Outputs
  dmux.out.name("out").output();

  test.each`
    input  | sel     | out
    ${"0"} | ${"00"} | ${"0000"}
    ${"0"} | ${"01"} | ${"0000"}
    ${"0"} | ${"10"} | ${"0000"}
    ${"0"} | ${"11"} | ${"0000"}
    ${"1"} | ${"00"} | ${"0001"}
    ${"1"} | ${"01"} | ${"0010"}
    ${"1"} | ${"10"} | ${"0100"}
    ${"1"} | ${"11"} | ${"1000"}
  `("[$input][$sel] == $out", ({ input, sel, out }) => {
    sim.setPins({ input, sel });
    expect(sim.readPins("input", "sel")).toEqual({ input, sel });
    sim.evalOutputs();
    expect(sim.readPins("out")).toEqual({ out });
  });
});
