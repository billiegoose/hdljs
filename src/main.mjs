import fs from 'fs';

global.chipRegistry = new Map();

import { ChipDef } from './components/ChipDef.mjs';
import { compileJs } from './compilers/javascript.mjs'
import { compileVerilog} from './compilers/verilog.mjs'
import { compileVerilogTestHarnessChip } from './compilers/verilogTestHarness.mjs'

const Nand = new ChipDef(`CHIP Nand {
  IN a,b;
  OUT out;
}`)

let joe, bob, foo
joe = Nand.internalSize

const Not = new ChipDef(`CHIP Not {
  IN a;
  OUT out;
  Nand(a=a, b=a, out=out);
}`);

joe = Not.pins.get('a')

joe = Not.pins.get('out')

// joe = Not.vram

const And = new ChipDef(`
CHIP And {
  IN a, b;
  OUT out;
  PARTS:
  Nand(a=a, b=b, out=c);
  Not(a=c, out=out);
}`)

joe = And.matrix

joe = And.internalPins.get('c')

bob = And.width

const Or = new ChipDef(`
CHIP Or {
  IN a, b;
  OUT out;
  PARTS:
  Not(a=a, out=na);
  Not(a=b, out=nb);
  Nand(a=na, b=nb, out=out);
}`)
function concatJs () {
  let text = ''
  for (let chip of global.chipRegistry.values()) {
    if (chip.name === 'Nand') {
      text += `function Nand (a, b) {
  // builtin
  let out;
  out = !(a && b);
  return [out];
}
\n`
    } else {
      text += `${chip.compileJs()}\n\n`
      // text += `${chip.compileVerilog()}\n\n`
    }
  }
  return text;
}

// function compileJs () {
//   return Function(`"use strict";

// ${concatJs()}return {${[...global.chipRegistry.keys()].join(', ')}}`);
// }

console.log(compileVerilog(global.chipRegistry))
fs.writeFileSync('design.sv', compileVerilog(global.chipRegistry))
console.log(compileVerilogTestHarnessChip(Or, compileJs(global.chipRegistry)().Or))
let lastChip = [...global.chipRegistry.values()][global.chipRegistry.size - 1]
console.log(lastChip);
let lastChipJs = compileJs(global.chipRegistry)()[lastChip.name]
console.log(lastChipJs)
fs.writeFileSync('testbench.sv', compileVerilogTestHarnessChip(lastChip, lastChipJs))

// foo = compileJs(global.chipRegistry)
// console.log(foo.toString())
// bob = foo()
// console.log(bob)
// console.log(bob.Or(1, 1))
