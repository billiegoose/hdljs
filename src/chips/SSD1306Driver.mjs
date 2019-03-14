import { ChipDef } from '../components/ChipDef.mjs';

// A driver for the SSD1306 128x64 pixel display from DIYmall

export const SSD1306Driver = new ChipDef(`
CHIP SSD1306Driver {
  IN load, address[9], in[16];
  OUT out[16], serial;

  PARTS:
  Inc16(in=videoAddress, out=nextVideoAddress);
  Register(in=nextVideoAddress, load=available, out=videoAddress);
  Mux16(sel=available, a=videoAddress, b=nextVideoAddress, out=useVideoAddress);
  VideoRAM512(
    load=load,
    address=address,
    out=out,
    videoAddress[0]=useVideoAddress[0],
    videoAddress[1]=useVideoAddress[1],
    videoAddress[2]=useVideoAddress[2],
    videoAddress[3]=useVideoAddress[3],
    videoAddress[4]=useVideoAddress[4],
    videoAddress[5]=useVideoAddress[5],
    videoAddress[6]=useVideoAddress[6],
    videoAddress[7]=useVideoAddress[7],
    videoAddress[8]=useVideoAddress[8],
    videoOut=videoOut
  );
  ShiftRegister(in=videoOut, load=available, out=serial, available=available);
}
`);