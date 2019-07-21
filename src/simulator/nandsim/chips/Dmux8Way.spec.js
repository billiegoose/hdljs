import { Dmux8Way } from "./index.js";
import { sim } from "../Gate.js";

describe("Dmux8Way", () => {
  // Define connections
  let dmux = new Dmux8Way();

  // Define Inputs
  dmux.in.name("input").input();
  dmux.sel.name("sel").input();

  // Define Outputs
  dmux.out.name("out").output();

  test.each`
    input  | sel      | out
    ${"0"} | ${"000"} | ${"00000000"}
    ${"0"} | ${"001"} | ${"00000000"}
    ${"0"} | ${"010"} | ${"00000000"}
    ${"0"} | ${"011"} | ${"00000000"}
    ${"0"} | ${"100"} | ${"00000000"}
    ${"0"} | ${"101"} | ${"00000000"}
    ${"0"} | ${"110"} | ${"00000000"}
    ${"0"} | ${"111"} | ${"00000000"}
    ${"1"} | ${"000"} | ${"00000001"}
    ${"1"} | ${"001"} | ${"00000010"}
    ${"1"} | ${"010"} | ${"00000100"}
    ${"1"} | ${"011"} | ${"00001000"}
    ${"1"} | ${"100"} | ${"00010000"}
    ${"1"} | ${"101"} | ${"00100000"}
    ${"1"} | ${"110"} | ${"01000000"}
    ${"1"} | ${"111"} | ${"10000000"}
  `("[$input][$sel] == $out", ({ input, sel, out }) => {
    sim.setPins({ input, sel });
    expect(sim.readPins("input", "sel")).toEqual({ input, sel });
    sim.evalOutputs();
    expect(sim.readPins("out")).toEqual({ out });
  });
});
