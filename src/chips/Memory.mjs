import { ChipDef } from '../components/ChipDef.mjs';

export const Memory = new ChipDef(`
CHIP Memory {
  IN load, address[15], in[16];
  OUT out[16];
  PARTS:
  DMux(sel=address[14], in=1, a=ram, b=peripheral);
  DMux(sel=address[13], in=peripheral, a=screen, b=keyboard);
  And(a=ram, b=load, out=load_ram);
  And(a=screen, b=load, out=load_screen);
  RAM16K(in=in, load=load_ram, address=address[1..13], out=ram_out);
  Screen(in=in, load=load_screen, address=address[0..13], out=screen_out);
  Keyboard(out=key_out);
  Mux16(sel=keyboard, a=screen_out, b=key_out, out=peripheral_out);
  Mux16(sel=ram, a=peripheral_out, b=ram_out, out=out);
}`).addBuiltin('verilog', `
module Memory (
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
  input address_9,
  input address_10,
  input address_11,
  input address_12,
  input address_13,
  input address_14,
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
  output out_15
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

  wire [14:0] address = {
    address_14,
    address_13,
    address_12,
    address_11,
    address_10,
    address_9,
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

  reg [15:0] dout; // Register for output.
  reg [15:0] mem [0:100];

  always @(posedge clock)
  begin
    if (load_0)
      mem[(address_0)] <= din;
    dout = mem[address_0]; // Output register controlled by clock.
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

  assign o_LED_1 = out_0;
  assign o_LED_2 = out_1;
  assign o_LED_3 = out_2;
  assign o_LED_4 = out_3;
endmodule
`)
// .test(`
// |   in   |load |     address     |  out   |
// |     -1 |  1  | 000000000000000 |      0 |
// |     -1 |  1  | 000000000000000 |     -1 |
// |   9999 |  0  | 000000000000000 |     -1 |
// |   9999 |  0  | 000000000000000 |     -1 |
// |   9999 |  0  | 010000000000000 |      0 |
// |   9999 |  0  | 100000000000000 |      0 |
// |   2222 |  1  | 010000000000000 |      0 |
// |   2222 |  1  | 010000000000000 |   2222 |
// |   9999 |  0  | 010000000000000 |   2222 |
// |   9999 |  0  | 010000000000000 |   2222 |
// |   9999 |  0  | 000000000000000 |     -1 |
// |   9999 |  0  | 100000000000000 |      0 |
// |   9999 |  0  | 000000000000001 |      0 |
// |   9999 |  0  | 000000000000010 |      0 |
// |   9999 |  0  | 000000000000100 |      0 |
// |   9999 |  0  | 000000000001000 |      0 |
// |   9999 |  0  | 000000000010000 |      0 |
// |   9999 |  0  | 000000000100000 |      0 |
// |   9999 |  0  | 000000001000000 |      0 |
// |   9999 |  0  | 000000010000000 |      0 |
// |   9999 |  0  | 000000100000000 |      0 |
// |   9999 |  0  | 000001000000000 |      0 |
// |   9999 |  0  | 000010000000000 |      0 |
// |   9999 |  0  | 000100000000000 |      0 |
// |   9999 |  0  | 001000000000000 |      0 |
// |   9999 |  0  | 010000000000000 |   2222 |
// |   1234 |  1  | 001001000110100 |      0 |
// |   1234 |  1  | 001001000110100 |   1234 |
// |   1234 |  0  | 010001000110100 |      0 |
// |   1234 |  0  | 110001000110100 |      0 |
// |   2345 |  1  | 010001101000101 |      0 |
// |   2345 |  1  | 010001101000101 |   2345 |
// |   2345 |  0  | 000001101000101 |      0 |
// |   2345 |  0  | 100001101000101 |      0 |
// |   2345 |  0  | 110000000000000 |     75 |
// |     -1 |  1  | 100111111001111 |     -1 |
// |     -1 |  1  | 101000001001111 |     -1 |
// |     -1 |  1  | 000111111001111 |      0 |
// |     -1 |  1  | 010111111001111 |      0 |
// |     -1 |  0  | 100111111001110 |      0 |
// |     -1 |  0  | 100111111001101 |      0 |
// |     -1 |  0  | 100111111001011 |      0 |
// |     -1 |  0  | 100111111000111 |      0 |
// |     -1 |  0  | 100111111011111 |      0 |
// |     -1 |  0  | 100111111101111 |      0 |
// |     -1 |  0  | 100111110001111 |      0 |
// |     -1 |  0  | 100111101001111 |      0 |
// |     -1 |  0  | 100111011001111 |      0 |
// |     -1 |  0  | 100110111001111 |      0 |
// |     -1 |  0  | 100101111001111 |      0 |
// |     -1 |  0  | 100011111001111 |      0 |
// |     -1 |  0  | 101111111001111 |      0 |
// |     -1 |  0  | 110000000000000 |     89 |
// `);
