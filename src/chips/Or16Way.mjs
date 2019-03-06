import { ChipDef } from '../components/ChipDef.mjs';

export const Or16Way = new ChipDef(`
CHIP Or16Way {
  IN in[16];
  OUT out;

  PARTS:
  Or8Way(in=in[0..7], out=low);
  Or8Way(in=in[8..15], out=high);
  Or(a=low, b=high, out=out);
}`);
