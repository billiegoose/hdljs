export function testJs (chips) {
  for (let chip of chipRegistry.values()) {
    if (chip.examples) {
      console.time(chip.name);
      process.stdout.write(`Testing ${chip.name}`)
      let chipInstance = new chips[chip.name]();
      for (let e = 0; e < chip.examples.length; e++) {
        const example = chip.examples[e];
        const inputValues = chip.inputNames().map(x => example[x])
        for (const name of chip.inputNames()) {
          chipInstance[name] = example[name];
        }
        if (example['time']) {
          if (example['time'].endsWith('+')) {
            chipInstance.tick(...inputValues);
          } else {
            chipInstance.tock(...inputValues);
          }
        } else {
          chipInstance.tick(...inputValues);
          chipInstance.tock(...inputValues);
        }
        for (const name of chip.outputNames()) {
          let val = example[name];
          if (val === undefined || Number.isNaN(val)) continue;
          if (example[name] !== chipInstance[name]) {
            throw new Error(`[${chip.name} chip] Test #${e + 1} ${example.time ? `at time='${example.time}'` : ``} failed for output ${name}. Expected value ${val}. Actual value ${chipInstance[name]}.`)
          }
        }
        process.stdout.write('.')
        // console.log(`PASS ${chip.name} #${e+1}`)
      }
      console.timeEnd(chip.name);
    }
  }
}
