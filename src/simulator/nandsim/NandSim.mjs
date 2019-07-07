const Logic = {
  UK: 0,
  LO: 1,
  HI: 2,
};

function translateLogic (logic) {
  switch (logic) {
    case Logic.HI: return '^';
    case Logic.LO: return '_';
    case Logic.UK: return '?';
  }
}

function nand (a, b) {
  if (a === Logic.LO || b === Logic.LO) return Logic.HI;
  if (a === Logic.UK || b === Logic.UK) return Logic.UK;
  if (a === Logic.HI && b === Logic.HI) return Logic.LO;
  throw "y9u fool";
}

function truthTable() {
  for (let a of [Logic.UK, Logic.LO, Logic.HI]) {
    for (let b of [Logic.UK, Logic.LO, Logic.HI]) {
      console.log(a, b, nand(a,b))
    }
  }
}

export class NandSim {
  constructor() {
    this.values = [];
    this.names = [];
    this.triplets = {};
    this.inputs = [];
    this.outputs = [];
  }
  addPin() {
    this.values.push(Logic.UK)
    return this.values.length - 1;
  }
  defineInput(index) {
    this.inputs.push(index)
  }
  defineOutput(index) {
    this.outputs.push(index)
  }
  namePin(index, name) {
    if (!this.names[index]) this.names[index] = []
    this.names[index].push(name)
  }
  // TODO: memoize
  lookupPin(name) {
    for (const [index, names] of this.names.entries()) {
      if (names) {
        for (const pinName of names) {
          if (pinName === name) {
            return index;
          }
        }
      }
    }
  }
  lookupIndex(index) {
    return this.names[index][0]
  }
  setPin(index, value) {
    this.values[index] = value;
  }
  setPins(inputs) {
    this.resetPins()
    for (const [name, value] of Object.entries(inputs)) {
      const index = this.lookupPin(name)
      this.setPin(index, value)
    }
  }
  resetPins() {
    this.values.fill(Logic.UK)
  }
  readPin(index) {
    return this.values[index];
  }
  readPins(...names) {
    const results = {}
    for (const name of names) {
      const index = this.lookupPin(name)
      const val = this.readPin(index)
      results[name] = translateLogic(val)
    }
    return results
  }
  addTriplet(a, b, out) {
    this.triplets[out] = {a, b};
  }
  evalPin(index) {
    const triplet = this.triplets[index];
    if (!triplet) {
      if (this.inputs.includes(index)) return this.values[index];
      throw new Error(`Pin ${index} cannot be evaluated because it is not connected to a gate output.`)
    }
    const {a, b} = this.triplets[index];
    if (nand(this.values[a], this.values[b]) === Logic.UK) {
      if (this.values[a] === Logic.UK) this.evalPin(a);
      if (this.values[b] === Logic.UK) this.evalPin(b);
    }
    this.values[index] = nand(this.values[a], this.values[b])
  }
  evalOutputs() {
    const results = {}
    for (const index of this.outputs) {
      const name = this.lookupIndex(index)
      this.evalPin(index)
      const val = this.readPin(index)
      results[name] = translateLogic(val)
    }
    return results
  }
  readInputs() {
    const results = {}
    for (const index of this.inputs) {
      const name = this.lookupIndex(index)
      const val = this.readPin(index)
      results[name] = translateLogic(val)
    }
    return results
  }
}

// Some tests

// Define Inputs
let sim = new NandSim()
let a = sim.addPin()
let b = sim.addPin()
let cin = sim.addPin()
sim.defineInput(a)
sim.defineInput(b)
sim.defineInput(cin)
sim.namePin(a, 'A')
sim.namePin(b, 'B')
sim.namePin(cin, 'C')

// Define Outputs
let sum = sim.addPin()
let carry = sim.addPin()
sim.defineOutput(sum)
sim.defineOutput(carry)
sim.namePin(sum, 'sum')
sim.namePin(carry, 'carry')

// Define internal junctions
let i0 = sim.addPin()
let i1 = sim.addPin()
let i2 = sim.addPin()
let hs = sim.addPin()
let j0 = sim.addPin()
let j1 = sim.addPin()
let j2 = sim.addPin()

// Define connections
sim.addTriplet(a, b, i0)
sim.addTriplet(a, i0, i1)
sim.addTriplet(b, i0, i2)
sim.addTriplet(i1, i2, hs)
sim.addTriplet(hs, cin, j0)
sim.addTriplet(hs, j0, j1)
sim.addTriplet(cin, j0, j2)
sim.addTriplet(j1, j2, sum)
sim.addTriplet(i0, j0, carry)

// Tests
sim.setPins({ A: Logic.LO, B: Logic.LO, C: Logic.LO })
console.log(sim.readInputs())
console.log(sim.evalOutputs())

sim.setPins({ A: Logic.LO, B: Logic.HI, C: Logic.LO })
console.log(sim.readInputs())
console.log(sim.evalOutputs())

sim.setPins({ A: Logic.HI, B: Logic.LO, C: Logic.LO })
console.log(sim.readInputs())
console.log(sim.evalOutputs())

sim.setPins({ A: Logic.HI, B: Logic.HI, C: Logic.LO })
console.log(sim.readInputs())
console.log(sim.evalOutputs())


sim.setPins({ A: Logic.LO, B: Logic.LO, C: Logic.HI })
console.log(sim.readInputs())
console.log(sim.evalOutputs())

sim.setPins({ A: Logic.LO, B: Logic.HI, C: Logic.HI })
console.log(sim.readInputs())
console.log(sim.evalOutputs())

sim.setPins({ A: Logic.HI, B: Logic.LO, C: Logic.HI })
console.log(sim.readInputs())
console.log(sim.evalOutputs())

sim.setPins({ A: Logic.HI, B: Logic.HI, C: Logic.HI })
console.log(sim.readInputs())
console.log(sim.evalOutputs())

sim.setPins({ A: Logic.LO, B: Logic.LO, C: Logic.UK })
console.log(sim.readInputs())
console.log(sim.evalOutputs())

sim.setPins({ A: Logic.HI, B: Logic.HI, C: Logic.UK })
console.log(sim.readInputs())
console.log(sim.evalOutputs())