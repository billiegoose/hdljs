import { ChipDef } from '../components/ChipDef.mjs';

export const Nand = new ChipDef(`
CHIP Nand {
  IN a,b;
  OUT out;
}`);

export const Copy = new ChipDef(`
CHIP Copy {
  IN in;
  OUT out;
}`);

export const DFF = new ChipDef(`
CHIP DFF {
  IN in;
  OUT out;
}`);

DFF.clocked = true;
