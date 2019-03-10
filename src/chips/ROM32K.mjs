import { ChipDef } from '../components/ChipDef.mjs';

export const ROM32K = new ChipDef(`
CHIP ROM32K {
  IN address[14];
  OUT out[16];
}
`).addBuiltin('js', `// builtin
class ROM32K {
  constructor () {
    this.memory = new Array(32 * 1024);
    this.memory.fill(0);
    this.address_0 = 0;
    this.address_1 = 0;
    this.address_2 = 0;
    this.address_3 = 0;
    this.address_4 = 0;
    this.address_5 = 0;
    this.address_6 = 0;
    this.address_7 = 0;
    this.address_8 = 0;
    this.address_9 = 0;
    this.address_10 = 0;
    this.address_11 = 0;
    this.address_12 = 0;
    this.address_13 = 0;
    this.out_0 = 0;
    this.out_1 = 0;
    this.out_2 = 0;
    this.out_3 = 0;
    this.out_4 = 0;
    this.out_5 = 0;
    this.out_6 = 0;
    this.out_7 = 0;
    this.out_8 = 0;
    this.out_9 = 0;
    this.out_10 = 0;
    this.out_11 = 0;
    this.out_12 = 0;
    this.out_13 = 0;
    this.out_14 = 0;
    this.out_15 = 0;
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
      this.address_12 * 4096 +
      this.address_13 * 8192 +
      this.address_15 * 16384;
    console.log('index', index);
    console.log(this.memory[index]);
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
}`);
