import { ChipDef } from '../components/ChipDef.mjs';

export const HalfClock = new ChipDef(`
CHIP HalfClock {
  IN clockIn, reset;
  OUT clockOut;

  PARTS:
  Blop(in=clockIn, out=flip);
  Mux(a=in, b=false, sel=reset, out=loadthis);
  Or(a=flip, b=reset, out=loadnow);
  FastBit(in=loadthis, load=loadnow, slowOut=val, out=clockOut);
  Not(in=val, out=in);
}
`);
