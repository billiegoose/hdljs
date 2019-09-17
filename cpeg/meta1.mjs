const discard = (matcher) => (origtext) => {
  let [match, text] = matcher(origtext)
  if (match === null) return [null, origtext]
  return [[false], text]
}

const collapse = (matcher) => (origtext) => {
  let [matches, text] = matcher(origtext)
  if (matches === null) return [null, origtext]
  if (matches[1].length === 1) return [matches[1], text]
  return [matches, text]
}

const matchSequence = (matchers) => (origtext) => {
  let matches = []
  let text = origtext
  let currentMatch
  for (const matcher of matchers) {
    ;[currentMatch, text] = matcher(text)
    // todo: remove some of the backtracking
    if (currentMatch === null) return [null, origtext]
    matches.push(currentMatch)
  }
  matches = matches.filter(m => Boolean(m[0]))
  if (matches.length === 1) return [matches[0], text]
  return [matches, text]
}

const matchAlt = (matchers) => (origtext) => {
  // return the first match
  for (const matcher of matchers) {
    let [currentMatch, text] = matcher(origtext)
    if (currentMatch !== null) return [currentMatch, text]
  }
  return [null, origtext]
}

const mMatchRegex = (regex) => (origtext) => {
  let matches = origtext.match(regex)
  if (matches !== null) {
    text = origtext.slice(matches[0].length)
    return [['WHITESPACE', matches[0]], text]
  } else {
    return [null, origtext]
  }
}

const matchWhitespace = mMatchRegex(/^(\s*(--[^\n]*\n)?)*/)

const matchJustString = (origtext) => {
  if (origtext.startsWith("'")) {
    // search for ending quote
    let i = 1
    i = origtext.indexOf("'", i)
    while (i + 1 < origtext.length && origtext[i+1] === "'") {
      // keep searching
      i = origtext.indexOf("'", i + 2)
      if  (i === -1) {
        return [null, origtext]
      }
    }
    return [['STRING', origtext.slice(1, i).replace(/''/g, "'")], origtext.slice(i+1)]
  }
  return [null, origtext]
}

function matchJustNumber (origtext) {
  let matches = origtext.match(/^[0-9]+/)
  if (matches !== null) {
    let text = origtext.slice(matches[0].length)
    return [['NUMBER', matches[0]], text]
  } else {
    return [null, origtext]
  }
}

const matchString = matchSequence([
  discard(matchWhitespace),
  matchJustString
])

const mMatchLiteral = (literal) => (origtext) => {
  let _
  ;[_, text] = matchWhitespace(origtext)

  if (text.startsWith(literal)) {
    return [['LITERAL', literal], text.slice(literal.length)]
  }
  return [null, origtext]
}

const matchNumber = matchSequence([
  discard(matchWhitespace),
  matchJustNumber
])

const matchJustIdentifier = (origtext) => {
  let matches = origtext.match(/^[a-zA-Z_]\w*/)
  if (matches !== null) {
    let text = origtext.slice(matches[0].length)
    return [['ID', matches[0]], text]
  } else {
    return [null, origtext]
  }
}

const matchIdentifier = matchSequence([
  discard(matchWhitespace),
  matchJustIdentifier
])

const wrap = (type, cond = () => true) => (matcher) => (origtext) => {
  let [match, text] = matcher(origtext)
  if (match === null) return [match, origtext]
  if (!cond(match)) return [match, origtext]
  return [[type, match], text]
}

const matchGroup = wrap('GROUP')(matchSequence([
  discard(mMatchLiteral('(')),
  matchEx1,
  discard(mMatchLiteral(')'))
]))

const matchRepetition = wrap('REPEAT')(matchSequence([
  discard(mMatchLiteral('$')),
  matchEx1
]))

const matchType = wrap('TYPE')(matchSequence([
  discard(mMatchLiteral('{')),
  matchEx1,
  discard(mMatchLiteral(':')),
  matchIdentifier,
  discard(mMatchLiteral('}'))
]))

const matchEx3 = matchAlt([
  matchIdentifier,
  matchString,
  mMatchLiteral('.ID'),
  mMatchLiteral('.NUMBER'),
  mMatchLiteral('.STRING'),
  matchGroup,
  matchType,
  mMatchLiteral('.EMPTY'),
  matchRepetition
])

const matchWhile = (matcher) => (origtext) => {
  let list = []
  let text = origtext
  while(text.length > 0) {
    ;[value, text] = matcher(text)
    if (value !== null) {
      list.push(value)
    } else {
      break
    }
  }
  return [list, text]
}

function matchEx2 (origtext) {
  let value, text
  ;[value, text] = matchEx3(origtext)
  if (value === null) return [null, origtext]
  let list
  ;[list, text] = matchWhile(matchEx3)(text)
  if (list.length === 0) {
    return [value, text]
  }
  return [['SEQ', [value, ...list]], text]
}

function matchEx1 (origtext) {
  let value, text
  ;[value, text] = matchEx2(origtext)
  if (value === null) return [null, origtext]
  let list
  ;[list, text] = matchWhile(matchSequence([
    discard(mMatchLiteral('/')),
    matchEx2
  ]))(text)
  if (list.length === 0) {
    return [value, text]
  }
  return [['ALT', [value, ...list]], text]
}

const matchRule = wrap('RULE')(matchSequence([
  matchIdentifier,
  discard(mMatchLiteral('=')),
  matchEx1,
  discard(mMatchLiteral(';'))
]))

const matchRules = wrap('RULES')(matchWhile(matchRule))

const matchSyntax = wrap('SYNTAX')(matchSequence([
  discard(mMatchLiteral('.SYNTAX')),
  matchIdentifier,
  matchRules,
  discard(mMatchLiteral('.END'))
]))

function smartJoin (strs, joiner, indent, postjoiner = '') {
  if (strs.join(joiner).length > 80) {
    return strs.join(postjoiner + '\n' + ' '.repeat(indent) + joiner.trimStart())
  }
}

function print(ast, indent = 0) {
  const [type, value] = ast
  switch(type) {
    case 'WHITESPACE': return value
    case 'LITERAL': return value
    case 'ID': return value
    case 'NUMBER': return `${value}`
    case 'STRING': return `'${value}'`
    case 'GROUP': return `( ${print(value)} )`
    case 'TYPE': return `{ ${print(value[1])} : ${print(value[0])} }`
    case 'REPEAT': return `$ ${print(value)}`
    case 'SEQ': return value.map(print).join(' ')
    case 'ALT': return smartJoin(value.map(print), ' / ', indent)
    case 'RULE': return `${print(value[0])} = ${print(value[1], value[0][1].length + 1)} ;`
    case 'RULES': return value.map(print).join('\n')
    case 'SYNTAX': return `.SYNTAX ${print(value[0])}\n${print(value[1])}`
    default: 
      console.log(ast)
      throw new Error(`Forgot about '${type}' did ye?`)
  }
}

const demo = `
-- An attempt at a CPEG metacompiler description

.SYNTAX CPEG

CPEG = { '.SYNTAX' .ID RULES '.END' : CPEG } ;

RULES = { $ RULE : RULES } ;

RULE = { .ID '=' RULEEX ';' : RULE } ;

RULEEX = { EX1 : EXP } ;

EX1 = { EX2 $ ( '/' EX2 ) : ALT } ;

EX2 = { EX3 $ EX3 : SEQ } ;

EX3 = .ID
    / { .STRING : LITERAL }
    / { '.ID' : ID }
    / { '.NUMBER' : NUMBER }
    / { '.STRING' : STRING }
    / { '(' EX1 ')' : GROUP }
    / { '{' EX1 ':' .ID '}' : TYPE }
    / '.EMPTY'
    / { '$' EX3 : REPEAT }
    ;

.END

.COMPILE CPEG

-- provide the .OUT function for each TYPE

Built in types:

.ID -- { [a-zA-Z_][a-zA-Z_0-9]* : ID }
.STRING -- { '[^']' : STRING }
.NUMBER -- { [0-9]+ : NUMBER }

`

console.log(require('prettier').format(JSON.stringify(matchSyntax(demo)[0])))
// console.log(JSON.stringify(matchSyntax(demo)[0], null, 2))

console.log(print(matchSyntax(demo)[0]))



function compileParser(ast, indent = 0) {
  const [type, value] = ast
  switch(type) {
    case 'WHITESPACE': return ''
    case 'LITERAL': {
      switch (value) {
        case '.ID': return 'matchIdentifier'
        case '.STRING': return 'matchString'
        case '.NUMBER': return 'matchNumber'
        default: return `throw new Error('Invalid ${value}')`
      }
    }
    case 'ID': return `match${value}`
    case 'NUMBER': return 'matchNumber'
    case 'STRING': return `mMatchLiteral('${value}')`
    case 'GROUP': return 'matchGroup'
    case 'TYPE': return `wrap('${value[1][1]}')(${compileParser(value[0])})`
    case 'REPEAT': return `matchWhile(${compileParser(value)})`
    case 'SEQ': return `matchSequence([${smartJoin(value.map(compileParser), ',', 6)}])`
    case 'ALT': return `matchAlt([${smartJoin(value.map(compileParser), ',', 4)}])`
    case 'RULE': return `${' '.repeat(indent)}function match${value[0][1]} (text) { return ${compileParser(value[1])}(text) };`
    case 'RULES': return value.map(v => compileParser(v, indent)).join('\n')
    case 'SYNTAX': return `function parse${value[0][1]} (text) {\n${compileParser(value[1], 2)}\n  return match${value[0][1]}(text);\n}`
    default: 
      console.log(ast)
      throw new Error(`Forgot about '${type}' did ye?`)
  }
}

console.log(compileParser(matchSyntax(demo)[0]))