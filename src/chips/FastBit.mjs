import { ChipDef } from '../components/ChipDef.mjs';

export const FastBit = new ChipDef(`
CHIP FastBit {
  IN in, load;
  OUT out, slowOut;

  PARTS:
  Mux(a=store, b=in, sel=load, out=val);
  DFF(in=val, out=store);
  Copy(in=val, out=out);
  Copy(in=store, out=slowOut);
}`);