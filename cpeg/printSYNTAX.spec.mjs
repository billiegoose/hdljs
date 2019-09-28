/* eslint-env jest */
import fs from 'fs'
import { matchSYNTAX } from './matchSYNTAX.mjs'
import { printSYNTAX } from './printSYNTAX.mjs'

const demo = fs.readFileSync('grammar.cpeg', 'utf8')

describe('test', () => {
  const ast = matchSYNTAX(demo)[0]

  it("printer hasn't broken", () => {
    expect(printSYNTAX(ast)).toBe(`.SYNTAX SYNTAX
SYNTAX = { '.SYNTAX' .ID RULES '.END' : SYNTAX } ;
RULES = { $ RULE : RULES } ;
RULE = { .ID '=' RULEEX ';' : RULE } ;
RULEEX = { EX1 : EXP } ;
EX1 = { EX2 $ ( '/' EX2 ) : ALT } ;
EX2 = { EX3 $ EX3 : SEQ } ;
EX3 =
  {
    { .ID : ID } /
    { .STRING : STRING } /
    { '.ID' : LITERAL } /
    { '.NUMBER' : LITERAL } /
    { '.STRING' : LITERAL } /
    { '(' EX1 ')' : GROUP } /
    { '{' EX1 ':' .ID '}' : TYPE } /
    { '.EMPTY' : LITERAL } /
    { '$' EX3 : REPEAT }
  :
  TERM
  }
;
.END`)
  })
})
