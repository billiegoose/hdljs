import { observable } from "./mobx.module.mjs"

function wrapArg (name) {
  if (name === '0' || name === '1') return name;
  if (name === undefined) return '0';
  return `this.${name}`
}

export class Pin {
  constructor () {
    return observable({ value: 0 })
  }
}

export class Chip {
  constructor (chipDef, inputs = {}) {
    this.pins = observable.object(inputs)
    this.parts = observable.object({})
    // Create the necessary input pins for a top-level chip.
    if (Object.keys(inputs).length === 0) {
      console.log('toplevel')
      for (const name of chipDef.inputNames()) {
        this.pins[name] = new Pin();
      }
    }
    for (const part of chipDef.parts) {
      const chipname = part.chip.name;
      // Default to using just the chipname, Foo
      let partname = chipname;
      // If we already have a chip named Foo, rename it Foo_0
      // and set Foo to be a placeholder with the index we should use next
      if (this.parts[chipname] && typeof this.parts[chipname] !== 'number') {
        this.parts[`${chipname}_0`] = this.parts[chipname];
        this.parts[chipname] = 1;
      }
      // If we detect a placeholder at Foo, 
      if (this.parts[chipname] && typeof this.parts[chipname] === 'number') {
        // Use the name Foo_[placeholder]
        partname = `${chipname}_${this.parts[chipname]}`
      }
      // Map our current chip's pins to the parts inputs
      let inputs = {}
      for (const name of part.chip.inputNames()) {
        inputs[name] = this.pins[part.chip.mapping[name]]
      }
      // create the part
      const Class = getClass(chipname)
      let instance = new Class(global.chipRegistry.get(chipname), inputs);
      this.parts[partname] = instance;
      // hook up pins
      for (let [ext, int] of Object.entries(part.chip.mapping)) {
        if (part.chip.inputNames().includes(ext)) {
          // supply the part with the input pins
          console.log(`${chipDef.name} ${int} -> ${part.chip.name} ${ext}`)
          instance.pins[ext] = this.pins[int];
        } else {
          // take the part's output pins
          console.log(`${chipDef.name} ${int} <- ${part.chip.name} ${ext}`)
          this.pins[int] = instance.pins[ext];
        }
      }
    }
    // Remove placeholders
    for (const part of chipDef.parts) {
      const chipname = part.chip.name;
      // If we detect a placeholder at Foo, 
      if (this.parts[chipname] && typeof this.parts[chipname] === 'number') {
        delete this.parts[chipname]
      }
    }
  }
}

export const clock = new Pin()

export class Nand {
  constructor () {
    const a_0 = new Pin();
    const b_0 = new Pin();
    const self = this
    const out_0 = observable.object({
      get value() {
        // console.log(`get it! ${self.pins.a_0.value} ${self.pins.b_0.value}`)
        const a = self.pins.a_0.value;
        const b = self.pins.b_0.value;
        return Number(!(a && b));
      }
    });
    this.pins = observable.object({ a_0, b_0, out_0 })
    this.parts = {}
  }
}

export function getClass(name) {
  switch (name) {
    case 'Nand': return Nand;
    default: return Chip;
  }
}

export function compileChip (chip) {
  let fntext = ''
  fntext += `class ${chip.name} {\n`
  fntext += `  constructor () {\n`
  fntext += chip.inputNames().length > 0 ? `    // inputs\n` : ''
  for (let name of chip.inputNames()) {
    fntext += `    this.${name} = 0;\n`
  }
  fntext += chip.outputNames().length > 0 ? `    // outputs\n` : ''
  for (let name of chip.outputNames()) {
    fntext += `    this.${name} = 0;\n`
  }
  fntext += chip.internalNames().length > 0 ? `    // internal\n` : ''
  for (let name of chip.internalNames()) {
    fntext += `    this.${name} = 0;\n`
  }
  for (let i = 0; i < chip.parts.length; i++) {
    let part = chip.parts[i];
    fntext += `    this.${part.chip.name}_${i} = new ${part.chip.name}();\n`
  }
  fntext += `  }\n`
  fntext += `  tick () {\n`
  for (let i = 0; i < chip.parts.length; i++) {
    let part = chip.parts[i];
    fntext += compileTick(part.chip, mapping, i);
  }
  fntext += `  }\n`
  fntext += `  tock () {\n`
  for (let i = 0; i < chip.parts.length; i++) {
    let part = chip.parts[i];
    fntext += `    this.${part.chip.name}_${i}.tock();\n`
  }
  fntext += `    this.tick();\n`
  fntext += `  }\n`
  fntext += `}`
  return fntext;
}

export function concatJs (chipRegistry) {
  let text = '";\n\n'
  for (let chip of chipRegistry.values()) {
    if (chip.builtin && chip.builtin.js) {
      text += chip.builtin.js + '\n\n';
    } else {
      text += `${compileChip(chip)}\n\n`;
    }
  }
  return text;
}


export function compileJs (chipRegistry) {
  return Function(`"use strict";

${concatJs(chipRegistry)}return {${[...chipRegistry.keys()].join(', ')}}`);
}