import fs from 'fs';

import './chips/index.mjs'
import { compileJs, concatJs, testJs } from './compilers/js/index.mjs'
import { compileVerilog, compileVerilogTestHarnessChip, compileGoBoardWrapper} from './compilers/verilog/index.mjs'

fs.writeFileSync('out/design.sv', compileVerilog(global.chipRegistry))
fs.writeFileSync('out/design.js', concatJs(global.chipRegistry))
let lastChip = [...global.chipRegistry.values()][global.chipRegistry.size - 1]
let jsImplementations = compileJs(global.chipRegistry)()
let lastChipJs = jsImplementations[lastChip.name]
fs.writeFileSync('out/testbench.sv', compileVerilogTestHarnessChip(lastChip, lastChipJs))
fs.writeFileSync('out/goboard.sv', compileGoBoardWrapper(lastChip))
// console.log(lastChip.examples)
// console.log(compileGoBoardWrapper(lastChip));
testJs(jsImplementations);

import { autorun } from "./compilers/js/mobx.module.mjs"
import { Chip } from './compilers/js/interpreter.mjs';
let c = new Chip(global.chipRegistry.get('Mux'));
// autorun(() => {
//   console.log(`hello ${c.pins.out_0.value}`)
// })

// console.log(c);
// console.log(c.parts.Nand.pins.a_0.value);
// console.log(c.parts.Nand.pins.b_0.value);
// console.log(c.parts.Nand.pins.out_0.value);
// console.log('^^^')
// c.pins.in_0.value = 1;
// console.log(c.parts.Nand.pins.a_0.value);
// console.log(c.parts.Nand.pins.b_0.value);
// console.log(c.parts.Nand.pins.out_0.value);
// console.log('^^^^')
// c.pins.in_0.value = 0;
// console.log(`0: ${c.pins.out_0.value}`)
// c.pins.in_0.value = 1;
// console.log(`1: ${c.pins.out_0.value}`)
// c.pins.in_0.value = 0;
// console.log(`0: ${c.pins.out_0.value}`)
// c.pins.in_0.value = 1;
// console.log(`1: ${c.pins.out_0.value}`)

console.log(c);
c.pins.sel_0.value = 0;
c.pins.a_0.value = 0;
c.pins.b_0.value = 0;
console.log(`0,0: ${c.pins.out_0.value}`)
c.pins.a_0.value = 0;
c.pins.b_0.value = 1;
console.log(`0,1: ${c.pins.out_0.value}`)
c.pins.a_0.value = 1;
c.pins.b_0.value = 0;
console.log(`1,0: ${c.pins.out_0.value}`)
c.pins.a_0.value = 1;
c.pins.b_0.value = 1;
console.log(`1,1: ${c.pins.out_0.value}`)

c.pins.sel_0.value = 1;
c.pins.a_0.value = 0;
c.pins.b_0.value = 0;
console.log(`0,0: ${c.pins.out_0.value}`)
c.pins.a_0.value = 0;
c.pins.b_0.value = 1;
console.log(`0,1: ${c.pins.out_0.value}`)
c.pins.a_0.value = 1;
c.pins.b_0.value = 0;
console.log(`1,0: ${c.pins.out_0.value}`)
c.pins.a_0.value = 1;
c.pins.b_0.value = 1;
console.log(`1,1: ${c.pins.out_0.value}`)