
function matchWhitespace (text) {
  let matches = text.match(/^(\s*(--[^\n]*\n)?)*/);
  if (matches !== null) {
    text = text.slice(matches[0].length)
    return [['WHITESPACE',matches[0]], text]
  } else {
    return [null, text]
  }
}

function matchString (origtext) {
  let _
  ;[_, text] = matchWhitespace(origtext)

  if (text.startsWith("'")) {
    // search for ending quote
    let i = 1
    i = text.indexOf("'", i)
    while (i + 1 < text.length && text[i+1] === "'") {
      // keep searching
      i = text.indexOf("'", i + 2)
      if  (i === -1) {
        return [null, origtext]
      }
    }
    return [['STRING', text.slice(1, i).replace(/''/g, "'")], text.slice(i+1)]
  }
  return [null, origtext]
}

function matchLiteral (origtext, literal) {
  let _
  ;[_, text] = matchWhitespace(origtext)

  if (text.startsWith(literal)) {
    return [['LITERAL', literal], text.slice(literal.length)]
  }
  return [null, origtext]
}

function matchNumber (origtext) {
  let _
  ;[_, text] = matchWhitespace(origtext)
  let matches = text.match(/^[0-9]+/)
  if (matches !== null) {
    text = text.slice(matches[0].length)
    return [{type: 'NUMBER', value: matches[0]}, text]
  } else {
    return [null, origtext]
  }
}

function matchIdentifier (origtext) {
  let _
  ;[_, text] = matchWhitespace(origtext)
  let matches = text.match(/^[a-zA-Z_]\w*/)
  if (matches !== null) {
    text = text.slice(matches[0].length)
    return [['ID', matches[0]], text]
  } else {
    return [null, origtext]
  }
}

function matchGroup (origtext) {
  let _, text, body
  ;[_, text] = matchLiteral(origtext, '(')
  if (_ === null) return [null, origtext]
  ;[body, text] = matchEx1(text)
  if (body === null) return [null, origtext]
  ;[_, text] = matchLiteral(text, ')')
  if (_ === null) return [null, origtext]
  return [['GROUP', body], text]
}

function matchRepetition (origtext) {
  let _, text, body
  ;[_, text] = matchLiteral(origtext, '$')
  if (_ === null) return [null, origtext]
  ;[body, text] = matchEx1(text)
  if (body === null) return [null, origtext]
  return [['REPEAT', body], text]
}

function matchType (origtext) {
  let _, text, id
  ;[_, text] = matchLiteral(origtext, '{')
  if (_ === null) return [null, origtext]
  ;[body, text] = matchEx1(text)
  if (body === null) return [null, origtext]
  ;[_, text] = matchLiteral(text, ':')
  if (_ === null) return [null, origtext]
  ;[id, text] = matchIdentifier(text)
  if (id === null) return [null, origtext]
  ;[_, text] = matchLiteral(text, '}')
  if (_ === null) return [null, origtext]
  return [['TYPE', [ id, body ]], text]
}

function matchEx3 (origtext) {
  let result
  result = matchIdentifier(origtext)
  if (result[0] !== null) return result
  result = matchString(origtext)
  if (result[0] !== null) return result
  result = matchLiteral(origtext, '.ID')
  if (result[0] !== null) return result
  result = matchLiteral(origtext, '.NUMBER')
  if (result[0] !== null) return result
  result = matchLiteral(origtext, '.STRING')
  if (result[0] !== null) return result
  result = matchGroup(origtext)
  if (result[0] !== null) return result
  result = matchType(origtext)
  if (result[0] !== null) return result
  result = matchLiteral(origtext, '.EMPTY')
  if (result[0] !== null) return result
  result = matchRepetition(origtext)
  if (result[0] !== null) return result
  return [null, origtext]
}

function matchEx2 (origtext) {
  let value, text
  ;[value, text] = matchEx3(origtext)
  if (value === null) return [null, origtext]
  let list = [value]
  while(text.length > 0) {
    ;[value, text] = matchEx3(text)
    if (value !== null) {
      list.push(value)
    } else {
      break
    }
  }
  if (list.length === 1) {
    return [list[0], text]
  }
  return [['SEQ', list], text]
}

function matchEx1 (origtext) {
  let value, text
  ;[value, text] = matchEx2(origtext)
  if (value === null) return [null, origtext]
  let list = [value]
  while(text.length > 0) {
    ;[value, text] = matchLiteral(text, '/')
    if (value === null) break
    ;[value, text] = matchEx2(text)
    if (value !== null) {
      list.push(value)
    } else {
      break
    }
  }
  if (list.length === 1) {
    return [list[0], text]
  }
  return [['ALT', list], text]
}

function matchRule (origtext) {
  let id, _, exp, text
  ;[id, text] = matchIdentifier(origtext)
  if (id === null) return [null, origtext]
  ;[_, text] = matchLiteral(text, '=')
  if (_ === null) return [null, origtext]
  ;[exp, text] = matchEx1(text)
  if (exp === null) return [null, origtext]
  ;[_, text] = matchLiteral(text, ';')
  if (_ === null) return [null, origtext]

  return [['RULE', [ id, exp ]], text]
}

function matchRules (origtext) {
  let rule, text
  ;[rule, text] = matchRule(origtext)
  if (rule === null) return [null, origtext]
  let list = [rule]
  while(text.length > 0) {
    ;[rule, text] = matchRule(text)
    if (rule !== null) {
      list.push(rule)
    } else {
      break
    }
  }
  return [['RULES', list], text]
}

function matchCPEG (origtext) {
  let _, id, rules, text
  ;[_, text] = matchLiteral(origtext, '.SYNTAX')
  if (_ === null) return [null, origtext]
  ;[id, text] = matchIdentifier(text)
  if (id === null) return [null, origtext]
  ;[rules, text] = matchRules(text)
  if (rules === null) return [null, origtext]
  ;[_, text] = matchLiteral(text, '.END')
  if (_ === null) return [null, origtext]
  return [['SYNTAX', [ id, rules ]], text]
}

function smartJoin (strs, joiner, indent) {
  if (strs.join(joiner).length > 80) {
    return strs.join('\n' + ' '.repeat(indent) + joiner.trimStart())
  }
}

function print(ast, indent = 0) {
  const [type, value] = ast
  switch(type) {
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
      throw new Error(`Forgot about '${ast.type}' did ye?`)
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

console.log(require('prettier').format(JSON.stringify(matchCPEG(demo)[0])))
// console.log(JSON.stringify(matchCPEG(demo)[0], null, 2))

console.log(print(matchCPEG(demo)[0]))
