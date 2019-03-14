import { ChipDef } from '../components/ChipDef.mjs';

export const VideoRAM512 = new ChipDef(`
CHIP VideoRAM512 {
  IN load, address[9], in[16], videoAddress[9];
  OUT out[16], videoOut[16];

  PARTS:
  DMux8Way(sel=address[0..2], in=load, a=la, b=lb, c=lc, d=ld, e=le, f=lf, g=lg, h=lh);
  VideoRAM64(in=in, load=la, address=address[3..8], out=a, videoAddress=videoAddress[3..8], videoOut=va);
  VideoRAM64(in=in, load=lb, address=address[3..8], out=b, videoAddress=videoAddress[3..8], videoOut=vb);
  VideoRAM64(in=in, load=lc, address=address[3..8], out=c, videoAddress=videoAddress[3..8], videoOut=vc);
  VideoRAM64(in=in, load=ld, address=address[3..8], out=d, videoAddress=videoAddress[3..8], videoOut=vd);
  VideoRAM64(in=in, load=le, address=address[3..8], out=e, videoAddress=videoAddress[3..8], videoOut=ve);
  VideoRAM64(in=in, load=lf, address=address[3..8], out=f, videoAddress=videoAddress[3..8], videoOut=vf);
  VideoRAM64(in=in, load=lg, address=address[3..8], out=g, videoAddress=videoAddress[3..8], videoOut=vg);
  VideoRAM64(in=in, load=lh, address=address[3..8], out=h, videoAddress=videoAddress[3..8], videoOut=vh);
  Mux8Way16(sel=address[0..2], a=a, b=b, c=c, d=d, e=e, f=f, g=g, h=h, out=out);
  Mux8Way16(sel=videoAddress[0..2], a=va, b=vb, c=vc, d=vd, e=ve, f=vf, g=vg, h=vh, out=videoOut);
}
`).addBuiltin('verilog', `
module VideoRAM512 (
  input clock,
  input load_0,
  input address_0,
  input address_1,
  input address_2,
  input address_3,
  input address_4,
  input address_5,
  input address_6,
  input address_7,
  input address_8,
  input in_0,
  input in_1,
  input in_2,
  input in_3,
  input in_4,
  input in_5,
  input in_6,
  input in_7,
  input in_8,
  input in_9,
  input in_10,
  input in_11,
  input in_12,
  input in_13,
  input in_14,
  input in_15,
  input videoAddress_0,
  input videoAddress_1,
  input videoAddress_2,
  input videoAddress_3,
  input videoAddress_4,
  input videoAddress_5,
  input videoAddress_6,
  input videoAddress_7,
  input videoAddress_8,
  output out_0,
  output out_1,
  output out_2,
  output out_3,
  output out_4,
  output out_5,
  output out_6,
  output out_7,
  output out_8,
  output out_9,
  output out_10,
  output out_11,
  output out_12,
  output out_13,
  output out_14,
  output out_15,
  output videoOut_0,
  output videoOut_1,
  output videoOut_2,
  output videoOut_3,
  output videoOut_4,
  output videoOut_5,
  output videoOut_6,
  output videoOut_7,
  output videoOut_8,
  output videoOut_9,
  output videoOut_10,
  output videoOut_11,
  output videoOut_12,
  output videoOut_13,
  output videoOut_14,
  output videoOut_15
);
  wire [15:0] din = {
    in_15,
    in_14,
    in_13,
    in_12,
    in_11,
    in_10,
    in_9,
    in_8,
    in_7,
    in_6,
    in_5,
    in_4,
    in_3,
    in_2,
    in_1,
    in_0
  };

  wire [8:0] address = {
    address_8,
    address_7,
    address_6,
    address_5,
    address_4,
    address_3,
    address_2,
    address_1,
    address_0
  };

  wire [8:0] videoAddress = {
    videoAddress_8,
    videoAddress_7,
    videoAddress_6,
    videoAddress_5,
    videoAddress_4,
    videoAddress_3,
    videoAddress_2,
    videoAddress_1,
    videoAddress_0
  };

  reg [15:0] dout; // Register for output.
  reg [15:0] vdout; // Register for video output.
  reg [15:0] mem [0:100];

  always @(posedge clock)
  begin
    if (load_0)
      mem[(address_0)] <= din;
    dout = mem[address]; // Output register controlled by clock.
    vdout = mem[videoAddress]; // Output video register controlled by clock.
  end

  assign out_0 = dout[0];
  assign out_1 = dout[1];
  assign out_2 = dout[2];
  assign out_3 = dout[3];
  assign out_4 = dout[4];
  assign out_5 = dout[5];
  assign out_6 = dout[6];
  assign out_7 = dout[7];
  assign out_8 = dout[8];
  assign out_9 = dout[9];
  assign out_10 = dout[10];
  assign out_11 = dout[11];
  assign out_12 = dout[12];
  assign out_13 = dout[13];
  assign out_14 = dout[14];
  assign out_15 = dout[15];

  assign videoOut_0 = vdout[0];
  assign videoOut_1 = vdout[1];
  assign videoOut_2 = vdout[2];
  assign videoOut_3 = vdout[3];
  assign videoOut_4 = vdout[4];
  assign videoOut_5 = vdout[5];
  assign videoOut_6 = vdout[6];
  assign videoOut_7 = vdout[7];
  assign videoOut_8 = vdout[8];
  assign videoOut_9 = vdout[9];
  assign videoOut_10 = vdout[10];
  assign videoOut_11 = vdout[11];
  assign videoOut_12 = vdout[12];
  assign videoOut_13 = vdout[13];
  assign videoOut_14 = vdout[14];
  assign videoOut_15 = vdout[15];
endmodule
`);
