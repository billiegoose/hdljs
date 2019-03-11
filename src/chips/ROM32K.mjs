import { ChipDef } from '../components/ChipDef.mjs';

export const ROM32K = new ChipDef(`
CHIP ROM32K {
  IN address[15];
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
    this.address_14 = 0;
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
      this.address_14 * 16384;
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
    // noop
  }
}`).addBuiltin('verilog', `// builtin
module ROM32K (
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
  // http://www.asic-world.com/verilog/memory_fsm1.html
  reg [15:0] my_memory [0:100]; // full 32K will be [0:32768]
  initial begin
    $readmemb("rom.mem", my_memory, 0, 100);
  end
  wire [14:0] bits = {
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
  wire [15:0] word = my_memory[bits];
  assign out_0 = word[0];
  assign out_1 = word[1];
  assign out_2 = word[2];
  assign out_3 = word[3];
  assign out_4 = word[4];
  assign out_5 = word[5];
  assign out_6 = word[6];
  assign out_7 = word[7];
  assign out_8 = word[8];
  assign out_9 = word[9];
  assign out_10 = word[10];
  assign out_11 = word[11];
  assign out_12 = word[12];
  assign out_13 = word[13];
  assign out_14 = word[14];
  assign out_15 = word[15];
endmodule`);
