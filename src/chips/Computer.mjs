import { ChipDef } from '../components/ChipDef.mjs';

export const CPU = new ChipDef(`
CHIP Computer {
  IN reset;
  PARTS:
  Memory(load=writeM, in=nextM, address=addressM, out=M);
  CPU(reset=reset, instruction=instruction, inM=M, pc=pc, outM=nextM, writeM=writeM, addressM=addressM);
  ROM32K(address=pc, out=instruction);
}`);
