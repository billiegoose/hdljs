const reverse = (str) => {
  const a = str.split('');
  a.reverse();
  return a.join('')
}

export function attachROM (chip) {
  document.getElementById("load").addEventListener('change', function () {
    let file = this.files[0]
    if (!file) return
    let fr = new FileReader();
    fr.addEventListener('loadend', function () {
      global.ROM = fr.result.trim().split('\n').map(
        line => parseInt(reverse(line.trim()), 2)
      )
    })
    fr.readAsText(file)
  })
  chip.addBuiltin('js', `
// builtin
function ROM32K () {
  let memory = global.ROM;
  return function ROM32K (address_0, address_1, address_2, address_3, address_4, address_5, address_6, address_7, address_8, address_9, address_10, address_11, address_12, address_13, address_14) {
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
      address_13 * 8192 +
      address_14 * 16384;
    let result = memory[index];
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