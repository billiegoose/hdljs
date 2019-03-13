import { ChipDef } from '../components/ChipDef.mjs';

// Similar to RAM64, but has two ports - one read/write and one read-only
export const VideoRAM64 = new ChipDef(`
CHIP VideoRAM64 {
  IN load, address[6], in[16], videoAddress[6];
  OUT out[16], videoOut[16];

  PARTS:
  DMux8Way(sel=address[0..2], in=load, a=la, b=lb, c=lc, d=ld, e=le, f=lf, g=lg, h=lh);
  VideoRAM8(in=in, load=la, address=address[3..5], out=a, videoAddress=videoAddress[3..5], videoOut=va);
  VideoRAM8(in=in, load=lb, address=address[3..5], out=b, videoAddress=videoAddress[3..5], videoOut=vb);
  VideoRAM8(in=in, load=lc, address=address[3..5], out=c, videoAddress=videoAddress[3..5], videoOut=vc);
  VideoRAM8(in=in, load=ld, address=address[3..5], out=d, videoAddress=videoAddress[3..5], videoOut=vd);
  VideoRAM8(in=in, load=le, address=address[3..5], out=e, videoAddress=videoAddress[3..5], videoOut=ve);
  VideoRAM8(in=in, load=lf, address=address[3..5], out=f, videoAddress=videoAddress[3..5], videoOut=vf);
  VideoRAM8(in=in, load=lg, address=address[3..5], out=g, videoAddress=videoAddress[3..5], videoOut=vg);
  VideoRAM8(in=in, load=lh, address=address[3..5], out=h, videoAddress=videoAddress[3..5], videoOut=vh);
  Mux8Way16(sel=address[0..2], a=a, b=b, c=c, d=d, e=e, f=f, g=g, h=h, out=out);
  Mux8Way16(sel=videoAddress[0..2], a=va, b=vb, c=vc, d=vd, e=ve, f=vf, g=vg, h=vh, out=videoOut);
}
`);