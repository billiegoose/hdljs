import { ChipDef } from '../components/ChipDef.mjs';

export const HalfClock = new ChipDef(`
CHIP HalfClock {
  IN clockIn;
  OUT clockOut;

  PARTS:
  Blip(in=clockIn, out=flip);
  FastBit(in=in, load=flip, slowOut=val, out=clockOut);
  Not(in=val, out=in);
}`);
