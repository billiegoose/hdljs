import { sim, Bus, InputPin, Gate } from "./Gate.js";

describe("Bus", () => {
  // Define connections
  let p0 = new InputPin();
  let p1 = new InputPin();
  let p2 = new InputPin();
  let p3 = new InputPin();
  let p4 = new InputPin();
  let p5 = new InputPin();
  let p6 = new InputPin();
  let p7 = new InputPin();
  let bus = new Bus(p0, p1, p2, p3, p4, p5, p6, p7);

  test('has .length property', () => {
    expect(bus.length).toBe(8)
  });
  test('implements iteration protocol', () => {
    expect([...bus].length).toBe(8)
  });
  test('pin properties', () => {
    expect(bus[-1]).toBeUndefined()
    expect(bus[0]).toBe(p0)
    expect(bus[1]).toBe(p1)
    expect(bus[2]).toBe(p2)
    expect(bus[3]).toBe(p3)
    expect(bus[4]).toBe(p4)
    expect(bus[5]).toBe(p5)
    expect(bus[6]).toBe(p6)
    expect(bus[7]).toBe(p7)
    expect(bus[8]).toBeUndefined()
  });
  test('.slice returns a new Bus', () => {
    expect(bus.slice()).not.toBe(bus)
    expect(bus.slice()).toBeInstanceOf(Bus)
    let nibble = bus.slice(0, 4)
    expect(nibble[0]).toBe(p0)
    expect(nibble[1]).toBe(p1)
    expect(nibble[2]).toBe(p2)
    expect(nibble[3]).toBe(p3)
    expect(nibble[4]).toBeUndefined()
    expect(nibble[5]).toBeUndefined()
    expect(nibble[6]).toBeUndefined()
    expect(nibble[7]).toBeUndefined()
    nibble = bus.slice(4, 8)
    expect(nibble[0]).toBe(p4)
    expect(nibble[1]).toBe(p5)
    expect(nibble[2]).toBe(p6)
    expect(nibble[3]).toBe(p7)
    expect(nibble[4]).toBeUndefined()
    expect(nibble[5]).toBeUndefined()
    expect(nibble[6]).toBeUndefined()
    expect(nibble[7]).toBeUndefined()
  });
  test('.wire connects pins', () => {
    let b1 = bus.slice(0, 2)
    let b2 = bus.slice(2, 4)
    let b3 = bus.slice(4, 6)
    let b4 = bus.slice(6, 8)
    b1.wire(...b2)
    b4.wire(...b3)
    b1[0].value = 1
    b3.wire(...b2)
    b4[1].value = 2
    expect(bus[0].value).toBe(1)
    expect(bus[1].value).toBe(2)
    expect(bus[2].value).toBe(1)
    expect(bus[3].value).toBe(2)
    expect(bus[4].value).toBe(1)
    expect(bus[5].value).toBe(2)
    expect(bus[6].value).toBe(1)
    expect(bus[7].value).toBe(2)
  })
  test('.wire validates bus width', () => {
    let b1 = bus.slice(0, 2)
    let b2 = bus.slice(2, 5)
    expect(() => b1.wire(...b2)).toThrow()
    expect(() => b2.wire(...b1)).toThrow()
    let b3 = bus.slice(-2)
    let b4 = bus.slice(-3)
    expect(() => b1.wire(...b3)).not.toThrow()
    expect(() => b2.wire(...b4)).not.toThrow()
  })
  test('.name property assigns pin names', () => {
    bus.name('MrBus')
    expect(sim.lookupPin('MrBus[0]')).toBe(bus[0].value)
    expect(sim.lookupPin('MrBus[1]')).toBe(bus[1].value)
    expect(sim.lookupPin('MrBus[2]')).toBe(bus[2].value)
    expect(sim.lookupPin('MrBus[3]')).toBe(bus[3].value)
    expect(sim.lookupPin('MrBus[4]')).toBe(bus[4].value)
    expect(sim.lookupPin('MrBus[5]')).toBe(bus[5].value)
    expect(sim.lookupPin('MrBus[6]')).toBe(bus[6].value)
    expect(sim.lookupPin('MrBus[7]')).toBe(bus[7].value)
    expect(sim.lookupPin('MrBus[8]')).toBeUndefined()
  })
  test('.attach attaches pin to a chip', () => {
    let foo = new Gate()
    bus.attach(foo, 'm')
    expect(foo.m).toBe(bus)
  })
});
