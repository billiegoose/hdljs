const { compile } = require('walt-compiler');

const compileAndInstantiate = async (
  src,
  imports,
  options = { encodeNames: true }
) => {
  const output = compile(src, options);
  if (options.debug) {
    // eslint-disable-next-line
    console.log(debug(output.wasm));
  }
  let result = await WebAssembly.instantiate(output.buffer(), imports);
  return result.instance.exports;
};

(async () => {
  let { Nand, Nand24 } = await compileAndInstantiate(`
  // We can't safely go higher than 24 bits because WALT truncates
  // unary operations at 24 bits.
  export function Nand24(a: i32, b: i32): i32 {
    return ~(a & b) & 0xffffff;
  }

  export function Nand(a: i32, b: i32): i32 {
    return ~(a & b) & 1;
  }`)
  let b = 7;
  console.log(b.toString(2).padStart(24, '0'))
  console.log(''.padStart(24, '-'))
  for (let i = 0; i < 10; i++) {
    console.log(Nand24(i, 7).toString(2).padStart(24, '0'))
  }
  console.log(Nand(0, 0))
  console.log(Nand(0, 1))
  console.log(Nand(1, 0))
  console.log(Nand(1, 1))
})();
