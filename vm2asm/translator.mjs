import Parser from './parser.mjs'
import Code from './code.mjs'
import { CommandType } from './types.mjs'

export default class Translator {
  constructor() {
    this.code = new Code()
  }
  translate (input) {
    // // symbol table pass
    // let p = new Parser(input)
    // while (p.hasMoreCommands()) {
    //   p.advance()
    //   switch (p.commandType) {
    //     case CommandType.L: {
    //       if (!st.contains(p.symbol)) {
    //         st.addEntry(p.symbol, p.address)
    //       }
    //     }
    //   }
    // }
    // code generation pass
    let p = new Parser(input)
    while (p.hasMoreCommands()) {
      p.advance()
      switch (p.commandType) {
        case CommandType.Push:
        case CommandType.Pop: {
          this.code.writePushPop(p.command, p.arg1, p.arg2)
          break;
        }
        case CommandType.Arithmetic: {
          this.code.writeArithmetic(p.command, p.arg1, p.arg2)
          break;
        }
      }
    }
  }
  get output () {
    return this.code.output
  }
}
