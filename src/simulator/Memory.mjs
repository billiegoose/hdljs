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
}`).test(`
|   in   |load |     address     |  out   |
|     -1 |  1  | 000000000000000 |      0 |
|     -1 |  1  | 000000000000000 |     -1 |
|   9999 |  0  | 000000000000000 |     -1 |
|   9999 |  0  | 000000000000000 |     -1 |
|   9999 |  0  | 010000000000000 |      0 |
|   9999 |  0  | 100000000000000 |      0 |
|   2222 |  1  | 010000000000000 |      0 |
|   2222 |  1  | 010000000000000 |   2222 |
|   9999 |  0  | 010000000000000 |   2222 |
|   9999 |  0  | 010000000000000 |   2222 |
|   9999 |  0  | 000000000000000 |     -1 |
|   9999 |  0  | 100000000000000 |      0 |
|   9999 |  0  | 000000000000001 |      0 |
|   9999 |  0  | 000000000000010 |      0 |
|   9999 |  0  | 000000000000100 |      0 |
|   9999 |  0  | 000000000001000 |      0 |
|   9999 |  0  | 000000000010000 |      0 |
|   9999 |  0  | 000000000100000 |      0 |
|   9999 |  0  | 000000001000000 |      0 |
|   9999 |  0  | 000000010000000 |      0 |
|   9999 |  0  | 000000100000000 |      0 |
|   9999 |  0  | 000001000000000 |      0 |
|   9999 |  0  | 000010000000000 |      0 |
|   9999 |  0  | 000100000000000 |      0 |
|   9999 |  0  | 001000000000000 |      0 |
|   9999 |  0  | 010000000000000 |   2222 |
|   1234 |  1  | 001001000110100 |      0 |
|   1234 |  1  | 001001000110100 |   1234 |
|   1234 |  0  | 010001000110100 |      0 |
|   1234 |  0  | 110001000110100 |      0 |
|   2345 |  1  | 010001101000101 |      0 |
|   2345 |  1  | 010001101000101 |   2345 |
|   2345 |  0  | 000001101000101 |      0 |
|   2345 |  0  | 100001101000101 |      0 |
|   2345 |  0  | 110000000000000 |     75 |
|     -1 |  1  | 100111111001111 |     -1 |
|     -1 |  1  | 101000001001111 |     -1 |
|     -1 |  1  | 000111111001111 |      0 |
|     -1 |  1  | 010111111001111 |      0 |
|     -1 |  0  | 100111111001110 |      0 |
|     -1 |  0  | 100111111001101 |      0 |
|     -1 |  0  | 100111111001011 |      0 |
|     -1 |  0  | 100111111000111 |      0 |
|     -1 |  0  | 100111111011111 |      0 |
|     -1 |  0  | 100111111101111 |      0 |
|     -1 |  0  | 100111110001111 |      0 |
|     -1 |  0  | 100111101001111 |      0 |
|     -1 |  0  | 100111011001111 |      0 |
|     -1 |  0  | 100110111001111 |      0 |
|     -1 |  0  | 100101111001111 |      0 |
|     -1 |  0  | 100011111001111 |      0 |
|     -1 |  0  | 101111111001111 |      0 |
|     -1 |  0  | 110000000000000 |     89 |
`);

// .addBuiltin('js', `
// function Screen () {
//   const RAM16K_0 = RAM16K();
//   const Screen_0 = Screen();
//   const Keyboard_0 = Keyboard();
//   return function Screen (load_0, address_0, address_1, address_2, address_3, address_4, address_5, address_6, address_7, address_8, address_9, address_10, address_11, address_12, address_13, address_14, in_0, in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8, in_9, in_10, in_11, in_12, in_13, in_14, in_15) {
//     let result
//     let load_ram = Number(load_0 && !address_15);
//     let load_screen = Number(load_0 && address_15 && !address_14);
//     let ram_results = RAM16K_0(load_ram, address_0, address_1, address_2, address_3, address_4, address_5, address_6, address_7, address_8, address_9, address_10, address_11, address_12, address_13, in_0, in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8, in_9, in_10, in_11, in_12, in_13, in_14, in_15);
//     let screen_results = Screen_0(load_screen, address_0, address_1, address_2, address_3, address_4, address_5, address_6, address_7, address_8, address_9, address_10, address_11, address_12, in_0, in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8, in_9, in_10, in_11, in_12, in_13, in_14, in_15);
//     let keyboard_results = Keyboard_0();
//     if (!address_15) {
//       return ram_results;
//     } else if (!address_14) {
//       return screen_results;
//     } else {
//       return keyboard_results;
//     }
//   }
// }`);
