global.chipRegistry = new Map();

import { Chip } from './Chip.mjs';
import { PinHeader } from './PinHeader.mjs'
import { Connection } from './Connection.mjs'
import { pinNames } from '../compilers/utils/pinNames.mjs';
import { pinName } from '../compilers/utils/pinName.mjs';
import { range } from '../compilers/utils/range.mjs'
export class ChipDef {
  constructor(str) {
    this.parse(str)
    global.chipRegistry.set(this.name, this);
  }
  parse(str) {
    str = str.trim()
    const match = /^CHIP\s+(?<name>\w+)\s+\{(?<body>[^\}]+)\}$/.exec(str);
    const { name, body } = match.groups;
    this.name = name;
    this.parts = []
    const statements = body.split(';').map(x => x.trim());
    for (let line of statements) {
      if (line.startsWith('IN')) {
        line = line.slice('IN'.length)
        const pinHeaders = line.split(',').map(x => new PinHeader(x.trim()))
        this.in = new Map(pinHeaders.map(x => [x.name, x]))
      } else if (line.startsWith('OUT')) {
        line = line.slice('OUT'.length)
        const pinHeaders = line.split(',').map(x => new PinHeader(x.trim()))
        this.out = new Map(pinHeaders.map(x => [x.name, x]))
      } else if (line === '') {
        // noop
      } else {
        if (line.startsWith('PARTS:')) {
          line = line.slice('PARTS:'.length);
        }
        this.parts.push(new Part(line));
      }
    }
    // Convenience
    this.pins = new Map([...this.in, ...this.out]);
    this.internalPins = new Map()
    // Static validation
    for (let part of this.parts) {
      const chip = part.chip;
      if (chip.clocked) this.clocked = true;
      for (let connection of part.connections) {
        const { int, ext } = connection;
        // Validate internal part pins
        if (!chip.pins.has(int.name)) {
          throw new Error(`Chip ${chip.name} does not have a pin named ${int.name}`)
        }
        const pin = chip.pins.get(int.name);
        int.pin = pin;
        // Infer implicit width based on chip
        if (int.implicit) {
          int.end = pin.width - 1;
        }
        if (int.end >= pin.width) {
          throw new Error(`Bus pin assignment ${int.print()} is out of range of ${part.chip.name} ${pin.print()}[${pin.width}]`)
        }
        // Validate external chip wiring
        // Infer implicit width based on opposite end of connection
        if (ext.implicit) {
          ext.end = ext.start + int.width - 1;
        }
        if (!this.pins.has(ext.name) && !this.internalPins.has(ext.name)) {
          console.log(`creating wire ${ext.name}`)
          let pin = new PinHeader(`${ext.name}[${ext.width}]`)
          this.internalPins.set(ext.name, pin)
        }
        let internalPin = this.pins.get(ext.name) || this.internalPins.get(ext.name);
        ext.pin = internalPin;
        if (ext.end >= internalPin.width) {
          throw new Error(`Bus pin assignment ${ext.print()} is out of range of ${this.name} ${internalPin.print()}[${internalPin.width}]`)
        }
      }
    }
    // If any of the pins are builtin pins, remove them
    this.internalPins.delete('true');
    this.internalPins.delete('false');
    this.internalPins.delete('1');
    this.internalPins.delete('0');
  }
  get width () {
    let sum = 0;
    for (let pin of this.pins.values()) {
      sum += pin.width;
    }
    return sum
  }
  get internalSize () {
    let sum = 0;
    for (let part of this.parts) {
      sum += part.chip.width;
    }
    for (let wire of this.internalPins.values()) {
      sum += wire.width
    }
    return sum
  }
  inputNames (opts) {
    return pinNames(this.in, opts);
  }
  outputNames (opts) {
    return pinNames(this.out, opts);
  }
  internalNames (opts) {
    return pinNames(this.internalPins, opts);
  }
  test (str) {
    const trim = (x) => x.trim();
    const notEmpty = (x) => x !== '';
    const trimEdges = (line) => {
      let matches = /^\s*\|(.*)\|\s*$/.exec(line)
      if (matches === null) throw new Error(line)
      return matches[1]
    }
    const [header, ...rows] = str.trim().split('\n').map(trim).filter(notEmpty).map(trimEdges);
    const names = header.split('|').map(trim)
    this.examples = []
    for (let row of rows.map(row => row.split('|').map(trim))) {
      let entry = {}
      row.forEach((col, i) => {
        let name = names[i];
        if (this.pins.has(name)) {
          let width = this.pins.get(name).width
          if (col.length === width) {
            // binary representation
            for (let i of range(col.length)) {
              entry[pinName(name, col.length - i - 1)] = parseInt(col[i])
            }
          } else {
            // decimal representation
            let n = parseInt(col);
            if (n < 0) n = 2**(width) + n;
            let bits = n.toString(2).padStart(width, '0');
            for (let i of range(width)) {
              entry[pinName(name, width - i - 1)] = parseInt(bits[i])
            }
          }
        }
      })
      this.examples.push(entry)
    }
    // allow chaining
    return this;
  }
  addBuiltin (lang, body) {
    if (!this.builtin) this.builtin = {};
    this.builtin[lang] = body
    // allow chaining
    return this;
  }
}

export class Part {
  constructor(str) {
    this.parse(str)
  }
  parse(str) {
    str = str.trim()
    const match = /^(?<name>\w+)\s*\((?<body>[^\)]*)\)$/.exec(str)
    if (match === null) {
      throw new Error(`Unable to parse: ${str}`)
    }
    const { name, body } = match.groups
    if (!global.chipRegistry.has(name)) {
      throw new Error(`Unregistered chip: ${name}`)
    }
    this.chip = new Chip(global.chipRegistry.get(name));
    const assignments = body.split(',').map(x => x.trim());
    this.connections = assignments.map(x => new Connection(x))
  }
  print () {
    return `${this.name}${this.width > 1 ? `[${this.width}]` : ''}`
  }
}
