let sourceText
let cursorStack
let rootStack // is actually a tree (stack of stacks)
let stackParents // [root, grandparent, parent]
let currentStack

import * as T from './types.mjs'

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

const _unwrap = (type) => (node) => {
  if (node[0] === type) return node[1]
  return node
}

// const unwrap = (type) => (matcher) => (origtext) => {
//   let [matches, text] = matcher(origtext)
//   if (matches === null) return [null, origtext]
//   if (matches[0] === type) return [matches[1], text]
//   return [[matches[0], matches[1].map(unwrap(type)], text]
//   console.log('---')
//   console.log('matches', matches)
//   console.log('type', type)
//   console.log('---')
//   let newmatches = []
//   let [_type, ...list] = matches
//   for (let match of list) {
//     if (match[0] === _type) {
//       if (Array.isArray(matches[1])) {
//         newmatches.push(...match[1])
//       } else {
//         newmatches.push(match[1])
//       }
//     } else {
//       newmatches.push(match)
//     }
//   }
//   return [[_type, newmatches], text]
// }

const matchSequence = (matchers) => (origtext) => {
  let matches = []
  let text = origtext
  let currentMatch
  for (const matcher of matchers) {
    ;[currentMatch, text] = matcher(text)
    // todo: remove some of the backtracking
    if (currentMatch === null) return [null, origtext]
    if (currentMatch[0] === 'WHILE') {
      console.log('---')
      console.log(currentMatch[0])
      console.log(currentMatch[1])
      matches.push(...currentMatch[1])
    } else {
      matches.push(currentMatch)
    }
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
    let text = origtext.slice(matches[0].length)
    return [new T.WHITESPACE(matches[0]), text]
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
    return [new T.STRING(origtext.slice(1, i).replace(/''/g, "'")), origtext.slice(i+1)]
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
  let [_, text] = matchWhitespace(origtext)

  if (text.startsWith(literal)) {
    return [new T.LITERAL(literal), text.slice(literal.length)]
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
    return [new T.ID(matches[0]), text]
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
  if (match.constructor.name === 'Array') {
    return [new T[type](...match), text]
  } else {
    return [new T[type](match), text]
  }
}

const matchGroup = wrap('GROUP')(matchSequence([
  discard(mMatchLiteral('(')),
  matchEx1,
  discard(mMatchLiteral(')'))
]))


const matchRepetition = wrap('REPEAT')(matchSequence([
  discard(mMatchLiteral('$')),
  matchEx3
]))

const matchType = wrap('TYPE')(matchSequence([
  discard(mMatchLiteral('{')),
  matchEx1,
  discard(mMatchLiteral(':')),
  matchIdentifier,
  discard(mMatchLiteral('}'))
]))

function matchEx3 (...args) { 
  return matchAlt([
    matchIdentifier,
    matchString,
    mMatchLiteral('.ID'),
    mMatchLiteral('.NUMBER'),
    mMatchLiteral('.STRING'),
    matchGroup,
    matchType,
    mMatchLiteral('.EMPTY'),
    matchRepetition
  ])(...args)
}

const matchWhile = (matcher) => (origtext) => {
  let list = []
  let text = origtext
  let value
  while(text.length > 0) {
    ;[value, text] = matcher(text)
    if (value !== null) {
      list.push(value)
    } else {
      break
    }
  }
  return [['WHILE', list], text]
}

const _matchWhile = (matcher) => (origtext) => {
  let list = []
  let text = origtext
  let value
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

// const matchEx2 = wrap('SEQ', m => m[1].length > 1)(matchSequence([
//   matchEx3,
//   matchWhile(matchEx3)
// ]))


function matchEx2 (origtext) {
  let value, text
  ;[value, text] = matchEx3(origtext)
  if (value === null) return [null, origtext]
  let list
  ;[list, text] = _matchWhile(matchEx3)(text)
  if (list.length === 0) {
    return [value, text]
  }
  return [new T.SEQ(value, ...list), text]
}

function matchEx1 (origtext) {
  let value, text
  ;[value, text] = matchEx2(origtext)
  if (value === null) return [null, origtext]
  let list
  ;[list, text] = _matchWhile(matchSequence([
    discard(mMatchLiteral('/')),
    matchEx2
  ]))(text)
  if (list.length === 0) {
    return [value, text]
  }
  return [new T.ALT(value, ...list), text]
}

const matchRule = wrap('RULE')(matchSequence([
  matchIdentifier,
  discard(mMatchLiteral('=')),
  matchEx1,
  discard(mMatchLiteral(';'))
]))

const matchRules = wrap('RULES')(_matchWhile(matchRule))

export const matchSyntax = wrap('SYNTAX')(matchSequence([
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

function commaJoin (strs, indent) {
  let plain = strs.join(',')
  const I =  ' '.repeat(indent)
  if (plain.length < 40) return plain
  return '\n' + I + strs.join(`,\n${I}`) + '\n' + ' '.repeat(indent - 2)
}

export function print(ast, indent = 0) {
  if (ast instanceof T.STRING) {
    return `'${ast[0]}'`
  }
  if (ast instanceof T.LITERAL) {
    return ast[0]
  }
  if (ast instanceof T.ID) {
    return ast[0]
  }
  if (ast instanceof T.GROUP) {
    return `( ${print(ast[0])} )`
  }
  if (ast instanceof T.TYPE) {
    return `{ ${print(ast[0])} : ${print(ast[1])} }`
  }
  if (ast instanceof T.WHILE) {
    return ast.map(print).join(' ')
  }
  if (ast instanceof T.REPEAT) {
    return `$ ${print(ast[0])}`
  }
  if (ast instanceof T.SEQ) {
    return ast.map(print).join(' ')
  }
  if (ast instanceof T.ALT) {
    return smartJoin(ast.map(print), ' / ', indent)
  }
  if (ast instanceof T.RULE) {
    return `${print(ast[0])} = ${print(ast[1], ast[0][0].length + 1)} ;`
  }
  if (ast instanceof T.RULES) {
    return ast.map(print).join('\n')
  }
  if (ast instanceof T.SYNTAX) {
    return `.SYNTAX ${print(ast[0])}\n${print(ast[1])}`
  }
  console.log(`Forgot about '${ast.constructor}' did ye?`)
}

export function compileParser(ast, indent = 0) {
  const I = ' '.repeat(indent)
  if (ast instanceof T.STRING) {
    return `mMatchLiteral('${ast[0]}')`
  }
  if (ast instanceof T.NUMBER) {
    return `matchNumber`
  }
  if (ast instanceof T.LITERAL) {
    switch (ast[0]) {
      case '.ID': return 'matchIdentifier'
      case '.STRING': return 'matchString'
      case '.NUMBER': return 'matchNumber'
      default: return `throw new Error('Invalid ${ast[0]}')`
    }
  }
  if (ast instanceof T.ID) {
    return `match${ast[0]}`
  }
  if (ast instanceof T.GROUP) {
    return `matchGroup`
  }
  if (ast instanceof T.TYPE) {
    return `wrap('${ast[1][0]}')(${compileParser(ast[0])})`
  }
  if (ast instanceof T.REPEAT) {
    return `matchWhile(${compileParser(ast[0])})`
  }
  if (ast instanceof T.SEQ) {
    return `matchSequence([${commaJoin(ast.map(compileParser), 6)}])`
  }
  if (ast instanceof T.ALT) {
    return `matchAlt([${commaJoin(ast.map(compileParser), 4)}])`
  }
  if (ast instanceof T.RULE) {
    return `${I}function match${ast[0][0]} (text) {\n${I}  return ${compileParser(ast[1])}(text)\n${I}};`
  }
  if (ast instanceof T.RULES) {
    return ast.map(v => compileParser(v, indent)).join('\n')
  }
  if (ast instanceof T.SYNTAX) {
    return `${I}function parse${ast[0][0]} (text) {\n${compileParser(ast[1], indent + 2)}\n  return match${ast[0][0]}(text);\n}`
  }
  console.log(`Forgot about '${ast.constructor}' did ye?`)
  // const [type, value] = ast
  // const I = ' '.repeat(indent)
  // switch(type) {
  //   case 'TYPE': return `wrap('${value[1][1]}')(${compileParser(value[0])})`
  //   case 'REPEAT': return `matchWhile(${compileParser(value)})`
  //   case 'SEQ': return `matchSequence([${commaJoin(value.map(compileParser), 6)}])`
  //   case 'ALT': return `matchAlt([${commaJoin(value.map(compileParser), 4)}])`
  //   case 'RULE': return `${I}function match${value[0][1]} (text) {\n${I}  return ${compileParser(value[1])}(text)\n${I}};`
  //   case 'RULES': return value.map(v => compileParser(v, indent)).join('\n')
  //   case 'SYNTAX': return `${I}function parse${value[0][1]} (text) {\n${compileParser(value[1], indent + 2)}\n  return match${value[0][1]}(text);\n}`
  //   default: 
  //     console.log(ast)
  //     throw new Error(`Forgot about '${type}' did ye?`)
  // }
}
