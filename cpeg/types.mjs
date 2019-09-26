// this is dumb, but looks nice in Jest Snapshots

class NODE extends Array {
  constructor(...args) {
    super()
    this.push(...args)
  }
}

export class WHITESPACE extends NODE {}
export class STRING extends NODE {}
export class NUMBER extends NODE {}
export class LITERAL extends NODE {}
export class ID extends NODE {}
export class GROUP extends NODE {}
export class SEQ extends NODE {}
export class ALT extends NODE {}
export class WHILE extends NODE {}
export class REPEAT extends NODE {}
export class TYPE extends NODE {}
export class RULE extends NODE {}
export class RULES extends NODE {}
export class SYNTAX extends NODE {}
