import { Bit } from "./Bit.js";
import { sim } from "../Gate.js";
import { Logic } from "../Logic.js";

describe("Bit", () => {
  // Define connections
  let bit = new Bit();

  // Define Inputs
  bit.in.name("input").input();
  bit.load.name("load").input();

  // Define Outputs
  bit.out.name("out").output();

  let clocktime = 0
  sim.evalOutputs();
  test.each`
    time   | input       | load        | out
    ${0.5} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
    ${1.0} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
    ${1.5} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
    ${2.0} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
    ${2.5} | ${Logic.HI} | ${Logic.LO} | ${Logic.LO}
    ${3.0} | ${Logic.HI} | ${Logic.LO} | ${Logic.LO}
    ${3.5} | ${Logic.HI} | ${Logic.HI} | ${Logic.LO}
    ${4.0} | ${Logic.HI} | ${Logic.HI} | ${Logic.HI}
    ${4.5} | ${Logic.LO} | ${Logic.LO} | ${Logic.HI}
    ${5.0} | ${Logic.LO} | ${Logic.LO} | ${Logic.HI}
    ${5.5} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI}
    ${6.0} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI}
    ${6.5} | ${Logic.LO} | ${Logic.HI} | ${Logic.HI}
    ${7.0} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
    ${7.5} | ${Logic.HI} | ${Logic.HI} | ${Logic.LO}
    ${8.0} | ${Logic.HI} | ${Logic.HI} | ${Logic.HI}
    ${8.5} | ${Logic.LO} | ${Logic.LO} | ${Logic.HI}
  `("$time: $input ^ $load -> $out", ({ time, input, load, out }) => {
    while (clocktime < time) {
      clocktime += 0.5;
      if (clocktime % 1 === 0) {
        sim.clock();
        sim.evalOutputs();
      }
    }
    sim.setPins({ input, load });
    sim.evalOutputs();
    expect(sim.readInputs()).toEqual({ input, load });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
