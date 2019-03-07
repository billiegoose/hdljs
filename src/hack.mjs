import fs from 'fs';
import './chips/index.mjs'
import { loadROM32K } from './chips/loadROM32K.mjs'
import { compileJs } from './compilers/js/compileJs.mjs'

const pfs = fs.promises;

if (process.argv.length < 3) {
  console.log('Usage: hack <rom file>')
  process.exit(0)
}

(async () => {

  const romImage = process.argv[2];
  const command = process.argv[3];
  const arg = process.argv[4];
  
  let buffer = await pfs.readFile(romImage, 'utf8')
  console.log(buffer)
  loadROM32K(buffer);
  console.log(global.chipRegistry);
  console.log(global.chipRegistry.get('ROM32K').builtin.js)
  let lastChip = [...global.chipRegistry.values()][global.chipRegistry.size - 1]
  console.log(lastChip.name)
  let chips = compileJs(global.chipRegistry)()
  let ROM32K = chips.ROM32K()
  if (command === 'peek') {
    console.log(
    ROM32K(
      Number(!!(arg & 1)), // 1
      Number(!!(arg & 2)),
      Number(!!(arg & 4)),
      Number(!!(arg & 8)), // 4
      Number(!!(arg & 16)),
      Number(!!(arg & 32)),
      Number(!!(arg & 64)),
      Number(!!(arg & 128)), // 8
      Number(!!(arg & 256)),
      Number(!!(arg & 512)),
      Number(!!(arg & 1024)),
      Number(!!(arg & 2048)), // 12
      Number(!!(arg & 4096)),
      Number(!!(arg & 8192)),
      Number(!!(arg & 16384)),
      Number(!!(arg & 32768)) // 16
    ));
  }
  // console.log(ROM32K(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0))
  
})();