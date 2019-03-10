import { Chip } from './interpreter.mjs';

function testOne(chipDef) {
  console.time(chipDef.name);
  let chip = new Chip(chipDef);
  process.stdout.write(`Testing ${chipDef.name}`)
  for (let e = 0; e < chipDef.examples.length; e++) {
    const example = chipDef.examples[e];
    const inputValues = chipDef.inputNames().map(x => example[x])
    for (const name of chipDef.inputNames()) {
      chip.pins[name].value = example[name];
    }
    if (example['time']) {
      if (example['time'].endsWith('+')) {
        chip.clock = 1;
      } else {
        chip.clock = 0;
      }
    } else {
      chip.clock = 1;
      chip.clock = 0;
    }
    for (const name of chipDef.outputNames()) {
      let val = example[name];
      if (val === undefined || Number.isNaN(val)) continue;
      if (example[name] !== chip.pins[name].value) {
        console.log(chip);
        throw new Error(`[${chipDef.name} chip] Test #${e + 1} ${example.time ? `at time='${example.time}'` : ``} failed for output ${name}. Expected value ${val}. Actual value ${chip.pins[name].value}.`)
      }
    }
    process.stdout.write('.')
    // console.log(`PASS ${chip.name} #${e+1}`)
  }
  console.timeEnd(chipDef.name);
}

export function interpreterTest (chipRegistry) {
  for (let chip of chipRegistry.values()) {
    if (chip.examples) {
      testOne(chip)
    }
  }
}
