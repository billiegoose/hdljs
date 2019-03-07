export function testJs (chips) {
  for (let chip of chipRegistry.values()) {
    if (chip.examples) {
      console.time(chip.name);
      process.stdout.write(`Testing ${chip.name}`)
      let chipInstance = chips[chip.name]();
      for (let e = 0; e < chip.examples.length; e++) {
        const example = chip.examples[e];
        const inputValues = chip.inputNames().map(x => example[x])
        const outputValues = chip.outputNames().map(x => example[x])
        const result = chipInstance.apply(null, inputValues);
        if (result.length !== outputValues.length) {
          throw new Error(`[${chip.name} chip] Unexpected length mismatch: expected ${outputValues.length} outputs but JS version of chip only output ${result.length}`)
        }
        for (let i = 0; i < result.length; i++) {
          if (result[i] !== outputValues[i]) {
            throw new Error(`[${chip.name} chip] Test #${e + 1} failed for output ${chip.outputNames()[i]}. Expected value ${outputValues[i]}. Actual value ${result[i]}.`)
          }
        }
        process.stdout.write('.')
        // console.log(`PASS ${chip.name} #${e+1}`)
      }
      console.timeEnd(chip.name);
    }
  }
}
