export function attachScreen (chip) {
  chip.addBuiltin('js', `
class Screen {
  constructor () {
    this.WIDTH = 512;
    this.HEIGHT = 256;
    this.memory = new Array(this.WIDTH / 16 * this.HEIGHT);
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.imagedata = this.ctx.createImageData(this.WIDTH, this.HEIGHT);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, 512, 256);
  }
  updateScreen () {
    this.ctx.putImageData(this.imagedata, 0, 0);
  }
  paint (addr, value) {
    data = this.imagedata.data
    data[addr * 4 + 0] = Math.floor(value * 255);
    data[addr * 4 + 1] = Math.floor(value * 255);
    data[addr * 4 + 2] = Math.floor(value * 255);
    data[addr * 4 + 3] = 255;
  }
  tick () {
    let index =
      this.address_0 +
      this.address_1 * 2 +
      this.address_2 * 4 +
      this.address_3 * 8 +
      this.address_4 * 16 +
      this.address_5 * 32 +
      this.address_6 * 64 +
      this.address_7 * 128 +
      this.address_8 * 256 +
      this.address_9 * 512 +
      this.address_10 * 1024 +
      this.address_11 * 2048 +
      this.address_12 * 4096;
    let result = this.memory[index];
    this.out_0 = Number(!!(result & 1)); // 1
    this.out_1 = Number(!!(result & 2));
    this.out_2 = Number(!!(result & 4));
    this.out_3 = Number(!!(result & 8)); // 4
    this.out_4 = Number(!!(result & 16));
    this.out_5 = Number(!!(result & 32));
    this.out_6 = Number(!!(result & 64));
    this.out_7 = Number(!!(result & 128)); // 8
    this.out_8 = Number(!!(result & 256));
    this.out_9 = Number(!!(result & 512));
    this.out_10 = Number(!!(result & 1024));
    this.out_11 = Number(!!(result & 2048)); // 12
    this.out_12 = Number(!!(result & 4096));
    this.out_13 = Number(!!(result & 8192));
    this.out_14 = Number(!!(result & 16384));
    this.out_15 = Number(!!(result & 32768)); // 16
  }
  tock () {
    let index =
      this.address_0 +
      this.address_1 * 2 +
      this.address_2 * 4 +
      this.address_3 * 8 +
      this.address_4 * 16 +
      this.address_5 * 32 +
      this.address_6 * 64 +
      this.address_7 * 128 +
      this.address_8 * 256 +
      this.address_9 * 512 +
      this.address_10 * 1024 +
      this.address_11 * 2048 +
      this.address_12 * 4096;
    if (this.load_0) {
      let input =
        this.in_0 +
        this.in_1 * 2 +
        this.in_2 * 4 +
        this.in_3 * 8 +
        this.in_4 * 16 +
        this.in_5 * 32 +
        this.in_6 * 64 +
        this.in_7 * 128 +
        this.in_8 * 256 +
        this.in_9 * 512 +
        this.in_10 * 1024 +
        this.in_11 * 2048 +
        this.in_12 * 4096 +
        this.in_13 * 8192 +
        this.in_14 * 16384 +
        this.in_15 * 32768;
      this.memory[index] = input;
      paint(index * 16 + 0, this.in_0);
      paint(index * 16 + 1, this.in_1);
      paint(index * 16 + 2, this.in_2);
      paint(index * 16 + 3, this.in_3);
      paint(index * 16 + 4, this.in_4);
      paint(index * 16 + 5, this.in_5);
      paint(index * 16 + 6, this.in_6);
      paint(index * 16 + 7, this.in_7);
      paint(index * 16 + 8, this.in_8);
      paint(index * 16 + 9, this.in_9);
      paint(index * 16 + 10, this.in_10);
      paint(index * 16 + 11, this.in_11);
      paint(index * 16 + 12, this.in_12);
      paint(index * 16 + 13, this.in_13);
      paint(index * 16 + 14, this.in_14);
      paint(index * 16 + 15, this.in_15);
    }
  }
}`);
}
