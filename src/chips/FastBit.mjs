import { ChipDef } from '../components/ChipDef.mjs';

export const FastBit = new ChipDef(`
CHIP FastBit {
  IN in, load, reset;
  OUT out, slowOut;

  PARTS:
  Mux(a=store, b=in, sel=load, out=val0);
  Mux(a=val0, b=false, sel=reset, out=val);
  DFF(in=val, out=store);
  Copy(in=val, out=out);
  Copy(in=store, out=slowOut);
}
`);
