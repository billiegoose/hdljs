import { Mux } from "./Mux.js";
import { sim } from "../Gate.js";
import { Logic } from "../Logic.js";

describe("Mux", () => {
  // Define connections
  let mux = new Mux();

  // Define Inputs
  mux.a.name("a").input();
  mux.b.name("b").input();
  mux.sel.name("sel").input();

  // Define Outputs
  mux.out.name("out").output();

  test.each`
    a           | b           | sel         | out
    ${Logic.LO} | ${Logic.LO} | ${Logic.LO} | ${Logic.LO}
    ${Logic.LO} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
    ${Logic.LO} | ${Logic.HI} | ${Logic.LO} | ${Logic.LO}
    ${Logic.LO} | ${Logic.HI} | ${Logic.HI} | ${Logic.HI}
    ${Logic.HI} | ${Logic.LO} | ${Logic.LO} | ${Logic.HI}
    ${Logic.HI} | ${Logic.LO} | ${Logic.HI} | ${Logic.LO}
    ${Logic.HI} | ${Logic.HI} | ${Logic.LO} | ${Logic.HI}
    ${Logic.HI} | ${Logic.HI} | ${Logic.HI} | ${Logic.HI}
  `("[$a, $b][$sel] == out", ({ a, b, sel, out }) => {
    sim.setPins({ a, b, sel });
    expect(sim.readInputs()).toEqual({ a, b, sel });
    expect(sim.evalOutputs()).toEqual({ out });
  });
});
