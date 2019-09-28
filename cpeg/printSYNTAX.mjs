// * * * * * * * * * * * * * * * * BEGIN PRELUDE * * * * * * * * * * * * * * * * //

function smartJoin (strs, joiner, indent, postjoiner = '') {
  if (strs.join(joiner).length > 80) {
    return strs.join(postjoiner + '\n' + ' '.repeat(indent) + joiner.trimStart())
  }
}

function _printSTRING(ast, indent = 0) {
  return `'${ast[0]}'`
}

function _printLITERAL(ast, indent = 0) {
  return String(ast[0])
}

function _printNUMBER(ast, indent = 0) {
  return Number(ast[0]).toFixed(0)
}

function _printID(ast, indent = 0) {
  return String(ast[0])
}

// * * * * * * * * * * * * * * * * END PRELUDE * * * * * * * * * * * * * * * * //

export { printSYNTAX }

function printSYNTAX (ast, indent = 0) {
  return `.SYNTAX ${_printID(ast[0])}\n${printRULES(ast[1], indent)}`
}

function printGROUP (ast, indent = 0) {
  return `( ${printEXP(ast[0])} )`
}

function printALT (ast, indent = 0) {
  return smartJoin(ast.map(printEXP), ' / ', indent)
}

function printSEQ (ast, indent = 0) {
  return ast.map(printEXP).join(' ')
}

function printRULES (ast, indent = 0) {
  return ast.map(printRULE).join('\n')
}

function printRULE (ast, indent = 0) {
  return `${printEXP(ast[0])} = ${printEXP(ast[1], ast[0][0].length + 1)} ;`
}

function printREPEAT (ast, indent = 0) {
  return `$ ${printEXP(ast[0])}`
}

function printTYPE (ast, indent = 0) {
  return `{ ${printEXP(ast[0])} : ${printEXP(ast[1])} }`
}

function printEXP (ast, indent = 0) {
  switch (ast.constructor.name) {
    case 'STRING': 
      return _printSTRING(ast, indent)
    case 'LITERAL':
      return _printLITERAL(ast, indent)
    case 'ID':
      return _printID(ast, indent)
    case 'GROUP':
      return printGROUP(ast, indent)
    case 'TYPE':
      return printTYPE(ast, indent)
    case 'REPEAT':
      return printREPEAT(ast, indent)
    case 'SEQ':
      return printSEQ(ast, indent)
    case 'ALT':
      return printALT(ast, indent)
    case 'EXP':
      return printEXP(ast[0], indent)
    case 'RULE':
      return printRULE(ast, indent)
    case 'RULES':
      return printRULES(ast, indent)
    case 'SYNTAX':
      return `.SYNTAX ${_printID(ast[0])}\n${printRULES(ast[1])}`
    default:
      return console.log(`Forgot about '${ast.constructor}' did ye?`)
  }
}
