import { Nand } from './Nand.mjs'

let n = new Nand()
let m = new Nand()

console.log(n.id, m.id)

// n.a = m.out
// m.out = n.a
// n.out = m.b
n.a = m.out
n.a = n.b
n.b = n.a

console.log(n.a.value, n.b.value, m.out.value)
// console.log(n._onseta, n._onsetb)

// import { SuperLightweightObservable } from './SuperLightweightObservable.mjs'

// let a = new SuperLightweightObservable()
// let b = new SuperLightweightObservable()
// let c = new SuperLightweightObservable()
// let d = new SuperLightweightObservable()
// let e = new SuperLightweightObservable()

// // a.subscribe(b)
// a.subscribe(b)
// b.subscribe(c)
// c.subscribe(d)
// d.subscribe(e)

// a.value = 3
// // b.subscribe(a)
// console.log(a.value, b.value, c.value, d.value, e.value)
