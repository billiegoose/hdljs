#!/usr/bin/env node --experimental-modules --no-warnings
// Accept input ASM in stdin
// Output HACK to stdout
import fs from 'fs'
import path from 'path'
import Translator from './translator.mjs'

const dirs = process.argv.slice(2)

if (dirs.length === 0) {
  console.log('Usage: vm2asm dirname')
  process.exit()
}

for (const dir of dirs) {
  const translator = new Translator()
  const base = path.basename(dir)
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.vm')) {
      const input = fs.readFileSync(path.join(dir, file), 'utf8')
      translator.translate(input)
    }
  }
  fs.writeFileSync(`${dir}/${base}.asm`, translator.output, 'utf8')
}
