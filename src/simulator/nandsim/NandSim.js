import { Logic } from './Logic.js'

function nand (a, b) {
  if (a === Logic.LO || b === Logic.LO) return Logic.HI;
  if (a === Logic.UK || b === Logic.UK) return Logic.UK;
  if (a === Logic.HI && b === Logic.HI) return Logic.LO;
  throw "Apparently I don't know ternary logic.";
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
    this.dffs = {};
    this.inputs = [];
    this.outputs = [];
    this.buses = {}
    this.cycleDetectionStack = [];
  }
  addPin() {
    this.values.push(Logic.UK)
    return this.values.length - 1;
  }
  // TODO: Modify to be name-based and support busses
  defineInput(index) {
    this.inputs.push(index)
  }
  defineOutput(index) {
    this.outputs.push(index)
  }
  nameBus(name, indices) {
    this.buses[name] = indices
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
  lookupBus(name) {
    return this.buses[name];
  }
  lookupIndex(index) {
    return this.names[index][this.names[index].length - 1]
  }
  setPin(index, value) {
    this.values[index] = value;
  }
  setPins(inputs) {
    this.resetPins()
    for (const [name, value] of Object.entries(inputs)) {
      // heuristic for Bus vs Pin
      // value is a string
      if (value.length > 1) {
        for (let i = 0; i < value.length; i++) {
          const index = this.lookupPin(`${name}[${i}]`)
          this.setPin(index, value[i])
        }
      } else {
        const index = this.lookupPin(name)
        this.setPin(index, value)
      }
    }
  }
  resetPins() {
    this.values.fill(Logic.UK)
  }
  readPin(index) {
    return this.values[index];
  }
  readBus(name) {
    return this.buses[name].map(index => this.readPin(index)).join('');
  }
  readPins(...names) {
    const results = {}
    for (const name of names) {
      if (this.lookupBus(name) !== void 0) {
        results[name] = this.readBus(name)
      } else {
        const index = this.lookupPin(name)
        const val = this.readPin(index)
        results[name] = val
      }
    }
    return results
  }
  addNand(a, b, out) {
    this.triplets[out] = {a, b};
  }
  addDFF(src, dest) {
    this.dffs[dest] = {src, val: Logic.LO};
  }
  clock() {
    for (const dff of Object.values(this.dffs)) {
      dff.val = this.values[dff.src]
    }
  }
  evalPin(index) {
    const triplet = this.triplets[index];
    const dff = this.dffs[index];
    if (!triplet && !dff) {
      if (this.inputs.includes(index)) return;
      throw new Error(`Pin ${index} ("${this.lookupIndex(index)}") cannot be evaluated because it is not connected to a gate output.`)
    }
    if (triplet) {
      const {a, b} = this.triplets[index];
      if (nand(this.values[a], this.values[b]) === Logic.UK) {
        if (this.cycleDetectionStack.includes(index)) {
          const msg = this.cycleDetectionStack.join(' -> ')
          this.cycleDetectionStack = []
          throw new Error(`Cycle detected in combinational logic: ${msg}`)
        }
        this.cycleDetectionStack.push(index);
        if (this.values[a] === Logic.UK) this.evalPin(a);
        if (this.values[b] === Logic.UK) this.evalPin(b);
        this.cycleDetectionStack.pop()
      }
      this.values[index] = nand(this.values[a], this.values[b])
    } else if (dff) {
      if (this.values[dff.src] === Logic.UK && !this.cycleDetectionStack.includes(dff.src)) {
        this.cycleDetectionStack.push(index);
        this.evalPin(dff.src)
        this.cycleDetectionStack.pop()
      }
      this.values[index] = dff.val
    }
  }
  evalOutputs() {
    const results = {}
    for (const index of this.outputs) {
      const name = this.lookupIndex(index)
      this.evalPin(index)
      const val = this.readPin(index)
      results[name] = val
    }
    return results
  }
  readInputs() {
    const results = {}
    for (const index of this.inputs) {
      const name = this.lookupIndex(index)
      const val = this.readPin(index)
      results[name] = val
    }
    return results
  }
}

// // Some tests

// // Define Inputs
// let sim = new NandSim()
// let a = sim.addPin()
// let b = sim.addPin()
// let cin = sim.addPin()
// sim.defineInput(a)
// sim.defineInput(b)
// sim.defineInput(cin)
// sim.namePin(a, 'A')
// sim.namePin(b, 'B')
// sim.namePin(cin, 'C')

// // Define Outputs
// let sum = sim.addPin()
// let carry = sim.addPin()
// sim.defineOutput(sum)
// sim.defineOutput(carry)
// sim.namePin(sum, 'sum')
// sim.namePin(carry, 'carry')

// // Define internal junctions
// let i0 = sim.addPin()
// let i1 = sim.addPin()
// let i2 = sim.addPin()
// let hs = sim.addPin()
// let j0 = sim.addPin()
// let j1 = sim.addPin()
// let j2 = sim.addPin()

// // Define connections
// sim.addNand(a, b, i0)
// sim.addNand(a, i0, i1)
// sim.addNand(b, i0, i2)
// sim.addNand(i1, i2, hs)
// sim.addNand(hs, cin, j0)
// sim.addNand(hs, j0, j1)
// sim.addNand(cin, j0, j2)
// sim.addNand(j1, j2, sum)
// sim.addNand(i0, j0, carry)

// // Tests
// sim.setPins({ A: Logic.LO, B: Logic.LO, C: Logic.LO })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())

// sim.setPins({ A: Logic.LO, B: Logic.HI, C: Logic.LO })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())

// sim.setPins({ A: Logic.HI, B: Logic.LO, C: Logic.LO })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())

// sim.setPins({ A: Logic.HI, B: Logic.HI, C: Logic.LO })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())


// sim.setPins({ A: Logic.LO, B: Logic.LO, C: Logic.HI })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())

// sim.setPins({ A: Logic.LO, B: Logic.HI, C: Logic.HI })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())

// sim.setPins({ A: Logic.HI, B: Logic.LO, C: Logic.HI })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())

// sim.setPins({ A: Logic.HI, B: Logic.HI, C: Logic.HI })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())

// sim.setPins({ A: Logic.LO, B: Logic.LO, C: Logic.UK })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())

// sim.setPins({ A: Logic.HI, B: Logic.HI, C: Logic.UK })
// console.log(sim.readInputs())
// console.log(sim.evalOutputs())



// // Define Inputs & Outputs
// let sim = new NandSim()
// let a = sim.addPin()
// let b = sim.addPin()
// let c = sim.addPin()
// let d = sim.addPin()
// let e = sim.addPin()
// sim.namePin(a, 'a')
// sim.namePin(b, 'b')
// sim.namePin(c, 'c')
// sim.namePin(d, 'd')
// sim.namePin(e, 'e')
// sim.defineInput(a)
// sim.defineOutput(e)

// // Define connections
// sim.addDFF(a, b)
// sim.addDFF(b, c)
// sim.addDFF(c, d)
// sim.addDFF(d, e)

// // Tests
// sim.setPins({ a: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))
// sim.clock()
// sim.setPins({ a: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))
// sim.clock()
// sim.setPins({ a: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))
// sim.clock()
// sim.setPins({ a: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))
// sim.clock()
// sim.setPins({ a: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))

// sim.clock()
// sim.setPins({ a: Logic.UK })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))
// sim.clock()
// sim.setPins({ a: Logic.UK })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))
// sim.clock()
// sim.setPins({ a: Logic.UK })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))
// sim.clock()
// sim.setPins({ a: Logic.UK })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))
// sim.clock()
// sim.setPins({ a: Logic.UK })
// sim.evalOutputs()
// console.log(sim.readPins('a', 'b', 'c', 'd', 'e'))



// // Traveling ringbuffer?
// let sim = new NandSim()
// let i = sim.addPin()
// let a = sim.addPin()
// let b = sim.addPin()
// let c = sim.addPin()
// let d = sim.addPin()
// let e = sim.addPin()
// let o = sim.addPin()
// sim.namePin(i, 'in')
// sim.namePin(a, 'a')
// sim.namePin(b, 'b')
// sim.namePin(c, 'c')
// sim.namePin(d, 'd')
// sim.namePin(e, 'e')
// sim.namePin(o, 'out')
// sim.defineInput(i)
// sim.defineOutput(o)

// // Define connections
// sim.addDFF(a, b)
// sim.addDFF(b, c)
// sim.addDFF(c, d)
// sim.addDFF(d, e)
// sim.addDFF(e, o)

// sim.addNand(i, o, a)

// // Tests
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))

// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.HI })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))
// sim.clock()
// sim.setPins({ in: Logic.LO })
// sim.evalOutputs()
// console.log(sim.readPins('in', 'a', 'b', 'c', 'd', 'e', 'out'))