import { Chip } from './Chip.mjs';
import { PinHeader } from './PinHeader.mjs'
import { Connection } from './Connection.mjs'

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
    // this.body = body;
    this.parts = []
    this.vram = []
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
      for (let connection of part.connections) {
        const { int, ext } = connection;
        // Validate internal part pins
        if (!chip.pins.has(int.name)) {
          throw new Error(`Chip ${chip.name} does not have a pin named ${int.name}`)
        }
        const pin = chip.pins.get(int.name);
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
          ext.end = int.end;
        }
        if (!this.pins.has(ext.name) && !this.internalPins.has(ext.name)) {
          // console.log(`creating wire ${ext.name}`)
          let pin = new PinHeader(`${ext.name}[${ext.width}]`)
          // console.log(pin)
          this.internalPins.set(ext.name, pin)
        }
        let internalPin = this.pins.get(ext.name) || this.internalPins.get(ext.name);
        if (internalPin.width !== ext.width) {
          console.log(internalPin.width, ext.width)
          throw new Error(`Bus width mismatch in RHS assignment ${ext.print()} does not match ${internalPin.print()}`)
        }
      }
    }
    // Allocate all the pins
    for (let header of this.pins.values()) {
      this.allocate(this, header)
    }
    for (let header of this.internalPins.values()) {
      this.allocate(this, header)
    }
    for (let part of this.parts) {
      const chip = part.chip;
      for (let header of chip.pins.values()) {
        this.allocate(part.chip, header)
      }
    }
    // Create the connectivity matrix
    this.matrix = []
    for (let i = 0; i < this.vram.length; i ++) {
      this.matrix[i] = Array(this.vram.length).fill(0);
    }
    for (let part of this.parts) {
      for (let connection of part.connections) {
        const { int, ext } = connection;
        const voffset1 = part.chip.pins.get(int.name).vramOffset
        const voffset2 = (this.pins.get(ext.name) || this.internalPins.get(ext.name)).vramOffset
        for (let i = 0; i < int.width; i++) {
          // console.log(`connect ${part.chip.name}.${int.name}[${i + int.start}] == ${ext.name}[${i + ext.start}]
          // ${voffset1 + i} to ${voffset2 + i}`)
          this.matrix[voffset1 + i][voffset2 + i] = 1;
          this.matrix[voffset2 + i][voffset1 + i] = 1;
        }
      }
    }
  }
  allocate (part, header) {
    header.vramOffset = this.vram.length
    let len = header.width;
    for (let i = 0; i < len; i++) {
      this.vram.push({
        part,
        header,
        addr: i
      })
    }
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
  print () {
    return `${this.name}
${this.vram.map((addr, i) => `  ${String(i).padStart(3, ' ')} ${addr.part.name} ${addr.header.name}`).join('\n')}
`
  }
  compileVerilogTestHarness () {
    return `module ${this.name}_Testbench ();
  // Local vars
${[...this.in.values()].map(arg =>
  `  reg ${arg.name} = ${arg.width}'b0;`
).join('\n')}
${[...this.out.values()].map(arg =>
  `  wire ${arg.name};`
).join('\n')}
    
  // Instantiate unit to test
  Nand Nand (
${[...this.pins.keys()].map(name =>
  `    .${name}(${name})`
).join('\n')}
  );
    
  // Test code
  initial begin
    $monitor("time: %d | ${[...this.pins.keys()].map(name =>
      `${name}= %b`
    ).join(' | ')}",$time,${[...this.pins.keys()].join(',')});
${(() => {
  let widths = [...this.in.values()].map(x => x.width);
  let names = [...this.in.values()].map(x => x.name);
  let text = ''
  combinations(widths, (values) => {
    text += `    #1\n`
    for (let i = 0; i < names.length; i++) {
      text += `    ${names[i]} <= ${values[i]}\n`
    }
  });
  return text;
})()}
    #1
    $finish;
  end
    
    //initial begin
    //  $dumpfile("dump.vcd"); $dumpvars;
    //end
    
  endmodule`
  }
}

class Part {
  constructor(str) {
    this.parse(str)
  }
  parse(str) {
    str = str.trim()
    const match = /^(?<name>\w+)\s*\((?<body>[^\)]*)\)$/.exec(str)
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
