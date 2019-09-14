import Parser from './parser.mjs'
import Code from './code.mjs'
import { CommandType } from './types.mjs'

export default class Translator {
  constructor() {
    this.code = new Code()
  }
  translate (filename, input) {
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
    this.code.setFileName(filename)
    while (p.hasMoreCommands()) {
      p.advance()
      switch (p.commandType) {
        case CommandType.Push:
        case CommandType.Pop: {
          this.code.writePushPop(p.command, p.arg1, p.arg2)
          break
        }
        case CommandType.Arithmetic: {
          this.code.writeArithmetic(p.command, p.arg1, p.arg2)
          break
        }
        case CommandType.Label: {
          this.code.writeLabel(p.arg1)
          break
        }
        case CommandType.Goto: {
          this.code.writeGoto(p.arg1)
          break
        }
        case CommandType.If: {
          this.code.writeIf(p.arg1)
          break
        }
        case CommandType.Function: {
          this.code.writeFunction(p.arg1)
          break
        }
      }
    }
  }
  get output () {
    return this.code.output
  }
}
