// * * * * * * * * * * * * * * * * BEGIN PRELUDE * * * * * * * * * * * * * * * * //

function smartJoin (strs, joiner, indent, postjoiner = '') {
  if (strs.join(joiner).length > 80) {
    return strs.join(postjoiner + '\n' + ' '.repeat(indent) + joiner.trimStart())
  }
}

// * * * * * * * * * * * * * * * * END PRELUDE * * * * * * * * * * * * * * * * //

export function printSYNTAX(ast, indent = 0) {
  switch (ast.constructor.name) {
    case 'STRING': 
      return `'${ast[0]}'`
    case 'LITERAL':
      return ast[0]
    case 'ID':
      return ast[0]
    case 'GROUP':
      return `( ${printSYNTAX(ast[0])} )`
    case 'TYPE':
      return `{ ${printSYNTAX(ast[0])} : ${printSYNTAX(ast[1])} }`
    case 'REPEAT':
      return `$ ${printSYNTAX(ast[0])}`
    case 'SEQ':
      return ast.map(printSYNTAX).join(' ')
    case 'ALT':
      return smartJoin(ast.map(printSYNTAX), ' / ', indent)
    case 'EXP':
      return printSYNTAX(ast[0], indent)
    case 'RULE':
      return `${printSYNTAX(ast[0])} = ${printSYNTAX(ast[1], ast[0][0].length + 1)} ;`
    case 'RULES':
      return ast.map(printSYNTAX).join('\n')
    case 'SYNTAX':
      return `.SYNTAX ${printSYNTAX(ast[0])}\n${printSYNTAX(ast[1])}`
    default:
      return console.log(`Forgot about '${ast.constructor}' did ye?`)
  }
}
