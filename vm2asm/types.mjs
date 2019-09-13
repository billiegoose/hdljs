export const CommandType = {
  NotDeterminedYet: 9,
  Arithmetic: 0,
  Push: 1,
  Pop: 2,
  Label: 3,
  Goto: 4,
  If: 5,
  Function: 6,
  Return: 7,
  Call: 8
}

export const ArithmeticCommand = {
  Add: 'add',
  Subtract: 'sub',
  Negate: 'neg',
  Equal: 'eq',
  GreaterThan: 'gt',
  LessThan: 'lt',
  And: 'and',
  Or: 'or',
  Not: 'not'
}

export const MemoryCommand = {
  Push: 'push',
  Pop: 'pop'
}

export const Segment = {
  Argument: 'argument',
  Local: 'local',
  Static: 'static',
  Constant: 'constant',
  This: 'this',
  That: 'that',
  Pointer: 'pointer',
  Temp: 'temp'
}

export const ProgramCommand = {
  Label: 'label',
  Goto: 'goto',
  IfGoto: 'if-goto',
  Function: 'function',
  Call: 'call',
  Return: 'return'
}
