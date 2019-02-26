import fs from 'fs';

import './chips.mjs'
import { compileJs } from './compilers/javascript.mjs'
import { compileVerilog} from './compilers/verilog.mjs'
import { compileVerilogTestHarnessChip } from './compilers/verilogTestHarness.mjs'
import { concatJs } from './compilers/javascript.mjs';

fs.writeFileSync('design.sv', compileVerilog(global.chipRegistry))
let lastChip = [...global.chipRegistry.values()][global.chipRegistry.size - 1]
console.log(lastChip);
let lastChipJs = compileJs(global.chipRegistry)()[lastChip.name]
fs.writeFileSync('design.js', concatJs(global.chipRegistry))
fs.writeFileSync('testbench.sv', compileVerilogTestHarnessChip(lastChip, lastChipJs))
