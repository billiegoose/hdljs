/* eslint-env jest */
import fs from 'fs'
import { matchSyntax, print, compileParser } from './meta1.mjs'

const demo = fs.readFileSync('grammar.cpeg', 'utf8')

describe('test', () => {
  const ast = matchSyntax(demo)[0]

  it("parser hasn't broken", () => {
    expect(ast).toMatchSnapshot()
  })
  it("printer hasn't broken", () => {
    expect(print(ast)).toMatchSnapshot()
  })
  it("compiler hasn't broken", () => {
    expect(compileParser(ast)).toMatchSnapshot()
  })
})

