// Accept input ASM in stdin
// Output HACK to stdout
import fs from 'fs'
import Parser from './parser.mjs'
import Code from './code.mjs'
import SymbolTable from './symbolTable.mjs'

const input = fs.readFileSync(process.stdin.fd, 'utf8');
let c = new Code()
let st = new SymbolTable()
// symbol table pass
let p = new Parser(input)
while (p.hasMoreCommands()) {
  p.advance()
  switch (p.commandType) {
    case 2: {
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
    case 0: {
      if (Number.isNaN(parseInt(p.symbol))) {
        if (!st.contains(p.symbol)) {
          st.addVariable(p.symbol)
        }
        p.symbol = st.getAddress(p.symbol)
      }
      process.stdout.write(c.literal(p.symbol))
      process.stdout.write('\n')
      break
    }
    case 1: {
      process.stdout.write('111')
      process.stdout.write(c.comp(p.comp))
      process.stdout.write(c.dest(p.dest))
      process.stdout.write(c.jump(p.jump))
      process.stdout.write('\n')
      break
    }
  }
}