import { RisingEdge } from "./RisingEdge.js";
import { sim } from "../Gate.js";

describe("RisingEdge", () => {
  // Define connections
  let risingEdge = new RisingEdge();

  // Define Inputs
  risingEdge.in.name("input").input();

  // Define Outputs
  risingEdge.out.name("out").output();

  let clocktime = 0;
  sim.evalOutputs();
  test.each`
    time     | input  | out
    ${0.5}   | ${"0"} | ${"0"}
    ${1.0}   | ${"0"} | ${"0"}
    ${1.5}   | ${"0"} | ${"0"}
    ${2.0}   | ${"1"} | ${"1"}
    ${2.5}   | ${"1"} | ${"1"}
    ${3.0}   | ${"1"} | ${"0"}
    ${3.5}   | ${"1"} | ${"0"}
    ${4.0}   | ${"1"} | ${"0"}
    ${4.5}   | ${"0"} | ${"0"}
    ${5.0}   | ${"0"} | ${"0"}
    ${5.5}   | ${"1"} | ${"1"}
    ${6.0}   | ${"1"} | ${"0"}
    ${6.5}   | ${"0"} | ${"0"}
    ${7.0}   | ${"0"} | ${"0"}
    ${7.5}   | ${"1"} | ${"1"}
    ${8.0}   | ${"1"} | ${"0"}
    ${8.5}   | ${"0"} | ${"0"}
    ${9.0}   | ${"0"} | ${"0"}
    ${9.5}   | ${"0"} | ${"0"}
    ${10.0}  | ${"0"} | ${"0"}
    ${10.5}  | ${"0"} | ${"0"}
    ${11.0}  | ${"0"} | ${"0"}
    ${11.5}  | ${"0"} | ${"0"}
    ${12.0}  | ${"1"} | ${"1"}
    ${12.5}  | ${"1"} | ${"1"}
    ${13.0}  | ${"1"} | ${"0"}
    ${13.5}  | ${"1"} | ${"0"}
    ${14.0}  | ${"0"} | ${"0"}
    ${14.5}  | ${"0"} | ${"0"}
    ${15.0}  | ${"0"} | ${"0"}
  `("$time: $input -> $out", ({ time, input, out }) => {
    while (clocktime < time) {
      clocktime += 0.5;
      if (clocktime % 1 === 0) {
        sim.clock();
        sim.evalOutputs();
      }
    }
    sim.setPins({ input });
    sim.evalOutputs();
    expect(sim.readInputs()).toEqual({ input });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
