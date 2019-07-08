import { Nand, sim } from './Nand.mjs'

let n = new Nand()
let m = new Nand()

console.log(n.id, m.id)

n.a = m.out
n.a = n.b
n.b = n.a

console.log(n.a.value, n.b.value, m.out.value)

m.a = m.b
m.a = n.out
n.place()
m.place()
console.log(sim.triplets)
