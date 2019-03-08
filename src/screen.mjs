import chalk from 'chalk';
import output from 'image-output';

// var output = require('image-output')
 
let data = []
const WIDTH = 512;
const HEIGHT = 256;

const paint = (x, y, color) => {
  data[y * WIDTH * 4 + x * 4 + 0] = color;
  data[y * WIDTH * 4 + x * 4 + 1] = color;
  data[y * WIDTH * 4 + x * 4 + 2] = color;
  data[y * WIDTH * 4 + x * 4 + 3] = 1;
}

for (let y = 0; y < 256; y++) {
  for (let x = 0; x < 512; x++) {
    let color = Number(Math.abs(x - y) % 2)
    paint(x, y, color);
  }
  // for (let i = 0; i < 256; i++) {
  //   data = data.concat([0,0,0,1, 1,1,1,1])
  // }
  // for (let i = 0; i < 256; i++) {
  //   data = data.concat([1,1,1,1, 0,0,0,1])
  // }
}


// create chess pattern png from raw pixels data
output({
    data,
    width: 512,
    height: 256
}, console);
// let str = ''
// for (let i = 0; i < 128; i++) {
//   str += `${chalk.bgWhite(" ")}${chalk.bgBlack("▀")}`.repeat(256)
//   str += `${chalk.bgBlack(" ")}${chalk.bgWhite("▀")}`.repeat(256)
// }
// console.log(str);