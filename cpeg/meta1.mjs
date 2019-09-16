
function matchWhitespace (text) {
  let matches = text.match(/^(\s*(--[^\n]*\n)?)*/);
  if (matches !== null) {
    text = text.slice(matches[0].length)
    return [{type: 'WHITESPACE', value: matches[0]}, text]
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
    return [{type: 'STRING', value: text.slice(1, i).replace(/''/g, "'")}, text.slice(i+1)]
  }
  return [null, origtext]
}

function matchLiteral (origtext, literal) {
  let _
  ;[_, text] = matchWhitespace(origtext)

  if (text.startsWith(literal)) {
    return [{type: literal, value: null}, text.slice(literal.length)]
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
    return [{type: 'ID', value: matches[0]}, text]
  } else {
    return [null, origtext]
  }
}

function matchGroup (origtext) {
  let _, text
  ;[_, text] = matchLiteral(origtext, '(')
  if (_ === null) return [null, origtext]
  let body
  ;[body, text] = matchEx2(text)
  if (body === null) return [null, origtext]
  ;[_, text] = matchLiteral(text, ')')
  if (_ === null) return [null, origtext]
  return [{type: 'GROUP', value: body}, text]
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
  return [null, origtext]
}

function matchEx2 (origtext) {
  let value, text
  ;[value, text] = matchEx3(origtext)
  if (value === null) return [null, origtext]
  let list = [value]
  let lasttext = ''
  while(text.length > 0 && text !== lasttext) {
    ;[value, text] = matchEx3(text)
    lasttext = text
    if (value !== null) {
      list.push(value)
    } else {
      break
    }
  }
  if (list.length === 1) {
    return [list[0], text]
  }
  return [{type: 'SEQ', value: list}, text]
}

function matchEx1 (origtext) {
  let value, text
  ;[value, text] = matchEx2(origtext)
  if (value === null) return [null, origtext]
  let list = [value]
  let lasttext = ''
  while(text.length > 0 && text !== lasttext) {
    ;[value, text] = matchLiteral(text, '/')
    if (value === null) break
    ;[value, text] = matchEx2(text)
    lasttext = text
    if (value !== null) {
      list.push(value)
    } else {
      break
    }
  }
  if (list.length === 1) {
    return [list[0], text]
  }
  return [{type: 'ALT', value: list}, text]
}

function matchRule (origtext) {
  let id, _, exp, text
  ;[id, text] = matchIdentifier(origtext)
  if (id === null) return [null, origtext]
  ;[_, text] = matchLiteral(text, '=')
  if (_ === null) return [null, origtext]
  ;[exp, text] = matchEx1(text)
  if (exp === null) return [null, origtext]

  return [{type: 'RULE', value: { id, exp }}, text]
}

function matchRules (origtext) {
  let rule, text
  ;[rule, text] = matchRule(origtext)
  if (rule === null) return [null, origtext]
  let list = [rule]
  let lasttext = ''
  while(text.length > 0 && text !== lasttext) {
    ;[rule, text] = matchRule(text)
    lasttext = text
    if (rule !== null) {
      list.push(rule)
    } else {
      break
    }
  }
  return [{type: 'RULES', value: list}, text]
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
  return [{type: 'CPEG', value: { id, rules }}, text]
}

console.log(matchCPEG(`.SYNTAX foo bar = goo .END`))