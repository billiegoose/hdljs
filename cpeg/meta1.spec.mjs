/* eslint-env jest */
import fs from 'fs'
import { matchSYNTAX, print, compileParser } from './meta1.mjs'

const demo = fs.readFileSync('grammar.cpeg', 'utf8')

describe('test', () => {
  const ast = matchSYNTAX(demo)[0]

  it("parser hasn't broken", () => {
    expect(ast).toMatchSnapshot()
  })
  it("printer hasn't broken", () => {
    expect(print(ast)).toBe(`.SYNTAX SYNTAX
SYNTAX = { '.SYNTAX' .ID RULES '.END' : SYNTAX } ;
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
    / { '$' EX3 : REPEAT } ;`)
  })
  it("compiler hasn't broken", () => {
    expect(true).toBe(true)
    console.log(compileParser(ast))
  })
})

