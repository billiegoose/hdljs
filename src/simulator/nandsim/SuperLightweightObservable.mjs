export class SuperLightweightObservable {
  _value = null
  observers = []
  constructor () {

  }
  subscribe(observer) {
    if (this._value === null) {
      if (!this.observers.includes(observer)) {
        this.observers.push(observer)
        observer.subscribe(this)
      }
    } else {
      observer.next(this._value)
    }
  }
  next(value) {
    this._value = value
    let observer
    while(observer = this.observers.shift()) observer.next(value)
  }
  set value (val) {
    this.next(val)
  }
  get value () {
    return this._value
  }
}