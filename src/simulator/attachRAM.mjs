export function attachRAM (chip) {
  global.RAM = new Array(2 ** 14);
  global.RAM.fill(0);

  const r0 = document.getElementById('r0');
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const r3 = document.getElementById('r3');
  const r4 = document.getElementById('r4');
  const r5 = document.getElementById('r5');
  const r6 = document.getElementById('r6');
  const r7 = document.getElementById('r7');
  const r8 = document.getElementById('r8');
  const r9 = document.getElementById('r9');
  const r10 = document.getElementById('r10');
  const r11 = document.getElementById('r11');
  const r12 = document.getElementById('r12');
  const r13 = document.getElementById('r13');
  const r14 = document.getElementById('r14');
  const r15 = document.getElementById('r15');

  const updateScreen = () => {
    requestAnimationFrame(updateScreen);
    r0.textContent = global.RAM[0];
    r1.textContent = global.RAM[1];
    r2.textContent = global.RAM[2];
    r3.textContent = global.RAM[3];
    r4.textContent = global.RAM[4];
    r5.textContent = global.RAM[5];
    r6.textContent = global.RAM[6];
    r7.textContent = global.RAM[7];
    r8.textContent = global.RAM[8];
    r9.textContent = global.RAM[9];
    r10.textContent = global.RAM[10];
    r11.textContent = global.RAM[11];
    r12.textContent = global.RAM[12];
    r13.textContent = global.RAM[13];
    r14.textContent = global.RAM[14];
    r15.textContent = global.RAM[15];
  }
  requestAnimationFrame(updateScreen);

  chip.addBuiltin('js', `
function RAM16K () {
  return function RAM16K (load_0, address_0, address_1, address_2, address_3, address_4, address_5, address_6, address_7, address_8, address_9, address_10, address_11, address_12, address_13, in_0, in_1, in_2, in_3, in_4, in_5, in_6, in_7, in_8, in_9, in_10, in_11, in_12, in_13, in_14, in_15) {
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
      address_12 * 4096 +
      address_13 * 8192;
    let result = global.RAM[index];
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
      global.RAM[index] = input;
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
}
