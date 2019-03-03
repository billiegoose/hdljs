import fs from 'fs';

import './chips.mjs'
import { compileJs } from './compilers/javascript.mjs'
import { compileVerilog} from './compilers/verilog.mjs'
import { compileVerilogTestHarnessChip } from './compilers/verilogTestHarness.mjs'
import { concatJs } from './compilers/javascript.mjs';
import { compileGoBoardWrapper } from './compilers/goBoard.mjs';

fs.writeFileSync('out/design.sv', compileVerilog(global.chipRegistry))
let lastChip = [...global.chipRegistry.values()][global.chipRegistry.size - 1]
let lastChipJs = compileJs(global.chipRegistry)()[lastChip.name]
fs.writeFileSync('out/design.js', concatJs(global.chipRegistry))
fs.writeFileSync('out/testbench.sv', compileVerilogTestHarnessChip(lastChip, lastChipJs))
fs.writeFileSync('out/goboard.sv', compileGoBoardWrapper(lastChip))
console.log(lastChip.examples)
console.log(compileGoBoardWrapper(lastChip));