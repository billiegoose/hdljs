import { ChipDef } from "../components/ChipDef.mjs"

export const Screen = new ChipDef(`
CHIP Screen {
  IN load, address[13], in[16];
  OUT out[16];
}`).addBuiltin('js', `
function Screen () {
  const WIDTH = 512;
  const HEIGHT = 256;
  let memory = new Array(WIDTH / 16 * HEIGHT);
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  var myImageData = ctx.createImageData(WIDTH, HEIGHT);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 512, 256);
  let data = myImageData.data;
  const paint = (addr, value) => {
    data[addr * 4 + 0] = Math.floor(value * 255);
    data[addr * 4 + 1] = Math.floor(value * 255);
    data[addr * 4 + 2] = Math.floor(value * 255);
    data[addr * 4 + 3] = 255;
  }
  const updateScreen = () => {
    requestAnimationFrame(updateScreen);
    ctx.putImageData(myImageData, 0, 0);
  }
  requestAnimationFrame(updateScreen);
  return function Screen (load_0, address_0, address_1, address_2, address_3, address_4, address_5, address_6, address_7, address_8, address_9, address_10, address_11, address_12, in_0, in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8, in_9, in_10, in_11, in_12, in_13, in_14, in_15) {
    let index =
      address_0 +
      address_1 * 2 +
      address_2 * 4 +
      address_3 * 8 +
      address_4 * 16 +
      address_5 * 32 +
      address_6 * 64 +
      address_7 * 128 +
      address_8 * 256 +
      address_9 * 512 +
      address_10 * 1024 +
      address_11 * 2048 +
      address_12 * 4096;
    let result = memory[index];
    if (load_0) {
      let input =
        in_0 +
        in_1 * 2 +
        in_2 * 4 +
        in_3 * 8 +
        in_4 * 16 +
        in_5 * 32 +
        in_6 * 64 +
        in_7 * 128 +
        in_8 * 256 +
        in_9 * 512 +
        in_10 * 1024 +
        in_11 * 2048 +
        in_12 * 4096 +
        in_13 * 8192 +
        in_14 * 16384 +
        in_15 * 32768;
      memory[index] = input;
      paint(index * 16 + 0, in_0);
      paint(index * 16 + 1, in_1);
      paint(index * 16 + 2, in_2);
      paint(index * 16 + 3, in_3);
      paint(index * 16 + 4, in_4);
      paint(index * 16 + 5, in_5);
      paint(index * 16 + 6, in_6);
      paint(index * 16 + 7, in_7);
      paint(index * 16 + 8, in_8);
      paint(index * 16 + 9, in_9);
      paint(index * 16 + 10, in_10);
      paint(index * 16 + 11, in_11);
      paint(index * 16 + 12, in_12);
      paint(index * 16 + 13, in_13);
      paint(index * 16 + 14, in_14);
      paint(index * 16 + 15, in_15);
    }
    return [
      Number(!!(result & 1)), // 1
      Number(!!(result & 2)),
      Number(!!(result & 4)),
      Number(!!(result & 8)), // 4
      Number(!!(result & 16)),
      Number(!!(result & 32)),
      Number(!!(result & 64)),
      Number(!!(result & 128)), // 8
      Number(!!(result & 256)),
      Number(!!(result & 512)),
      Number(!!(result & 1024)),
      Number(!!(result & 2048)), // 12
      Number(!!(result & 4096)),
      Number(!!(result & 8192)),
      Number(!!(result & 16384)),
      Number(!!(result & 32768)) // 16
    ];
  }
}`);