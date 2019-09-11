#!/usr/bin/env node --experimental-modules --no-warnings
// Accept input ASM in stdin
// Output HACK to stdout
import fs from 'fs'
import translate from './translate.mjs'

const files = process.argv.slice(2)

if (files.length === 0) {
  console.log('Usage: asm2hack filename')
  process.exit()
}

for (const file of files) {
  if (!file.endsWith('.asm')) {
    console.warn(`Ignoring ${file} because it is not a .asm file`)
  } else {
    const base = file.replace(/\.asm$/, '')
    const input = fs.readFileSync(file, 'utf8')
    const output = translate(input)
    fs.writeFileSync(`${base}.hack`, output, 'utf8')
  }
}
