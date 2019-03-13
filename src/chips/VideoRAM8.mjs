import { ChipDef } from '../components/ChipDef.mjs';

// Similar to RAM8, but has two ports - one read/write and one read-only
export const VideoRAM8 = new ChipDef(`
CHIP VideoRAM8 {
  IN load, address[3], in[16], videoAddress[3];
  OUT out[16], videoOut[16];

  PARTS:
  DMux8Way(sel=address, in=load, a=la, b=lb, c=lc, d=ld, e=le, f=lf, g=lg, h=lh);
  Register(in=in, load=la, out=a);
  Register(in=in, load=lb, out=b);
  Register(in=in, load=lc, out=c);
  Register(in=in, load=ld, out=d);
  Register(in=in, load=le, out=e);
  Register(in=in, load=lf, out=f);
  Register(in=in, load=lg, out=g);
  Register(in=in, load=lh, out=h);
  Mux8Way16(sel=address, a=a, b=b, c=c, d=d, e=e, f=f, g=g, h=h, out=out);
  Mux8Way16(sel=videoAddress, a=a, b=b, c=c, d=d, e=e, f=f, g=g, h=h, out=videoOut);
}
`);
