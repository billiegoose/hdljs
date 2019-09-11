import Parser from './parser.mjs'
import Code from './code.mjs'
import SymbolTable from './symbolTable.mjs'
import { CommandType } from './types.mjs'

export default function (input) {
  let output = ''
  let c = new Code()
  let st = new SymbolTable()
  // symbol table pass
  let p = new Parser(input)
  while (p.hasMoreCommands()) {
    p.advance()
    switch (p.commandType) {
      case CommandType.L: {
        if (!st.contains(p.symbol)) {
          st.addEntry(p.symbol, p.address)
        }
      }
    }
  }
  // code generation pass
  p = new Parser(input)
  while (p.hasMoreCommands()) {
    p.advance()
    switch (p.commandType) {
      case CommandType.A: {
        if (Number.isNaN(parseInt(p.symbol))) {
          if (!st.contains(p.symbol)) {
            st.addVariable(p.symbol)
          }
          p.symbol = st.getAddress(p.symbol)
        }
        output += c.literal(p.symbol)
        output += '\n'
        break
      }
      case CommandType.C: {
        output += '111'
        output += c.comp(p.comp)
        output += c.dest(p.dest)
        output += c.jump(p.jump)
        output += '\n'
        break
      }
    }
  }
  return output
}
