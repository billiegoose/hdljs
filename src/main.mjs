import fs from 'fs';

import './chips/index.mjs'
import { compileJs, concatJs, testJs } from './compilers/js/index.mjs'
import { compileVerilog, compileVerilogTestHarnessChip, compileGoBoardWrapper} from './compilers/verilog/index.mjs'

fs.writeFileSync('out/design.sv', compileVerilog(global.chipRegistry))
fs.writeFileSync('out/design.js', concatJs(global.chipRegistry))
console.log('yeah')
let lastChip = [...global.chipRegistry.values()][global.chipRegistry.size - 1]
let jsImplementations = compileJs(global.chipRegistry)()
let lastChipJs = jsImplementations[lastChip.name]
fs.writeFileSync('out/testbench.sv', compileVerilogTestHarnessChip(lastChip, lastChipJs))
// fs.writeFileSync('out/goboard.sv', compileGoBoardWrapper(lastChip))
// console.log(lastChip.examples)
// console.log(compileGoBoardWrapper(lastChip));
testJs(jsImplementations);
