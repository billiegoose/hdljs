import { Nand } from './Nand.mjs'

// Define connections
let n1 = new Nand()
let n2 = new Nand()
n2.a = n1.a
n2.b = n1.out
let n3 = new Nand()
n3.a = n1.b
n3.b = n2.b
let n4 = new Nand()
n4.a = n2.out
n4.b = n3.out
let n5 = new Nand()
n5.a = n4.out
let n6 = new Nand()
n6.a = n4.out
n6.b = n5.out
let n7 = new Nand()
n7.a = n5.b
n7.b = n6.b
let n8 = new Nand()
n8.a = n6.out
n8.b = n7.out
let n9 = new Nand()
n9.a = n1.out
n9.b = n5.out

// Define Inputs
n1.a.name('A').input()
n1.b.name('B').input()
n5.b.name('C').input()

// Define Outputs
n8.out.name('sum').output()
n9.out.name('carry').output()


























import { sim } from './Nand.mjs'
import { Logic } from './NandSim.mjs'

// Tests
sim.setPins({ A: Logic.LO, B: Logic.LO, C: Logic.LO })
// console.log(sim)
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

