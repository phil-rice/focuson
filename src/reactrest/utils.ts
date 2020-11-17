import {isFunction} from "util";

export function fromMap<K, V>(map: Map<K, V>, k: K): V {
    if (!map) throw Error('map is undefined')
    let result = map.get(k)
    if (result !== undefined) return result
    throw Error(`Cannot find data for ${k}\nLegal values are ${Array.from(map.keys()).sort()}`)
}


export function checkIsFunction(functionToCheck: any) {
    if (!isFunction(functionToCheck)) throw Error('getter should be a function, instead is ' + JSON.stringify(functionToCheck))
}
export function identity<T>(t: T): T {return t}

export class Lens<Main, Child> {
    get: (m: Main) => Child;
    set: (m: Main, newChild: Child) => Main;
    constructor(get: (m: Main) => Child, set: (m: Main, newChild: Child) => Main) {
        this.get = get;
        this.set = set;
    }

    andThen<NewChild>(l: Lens<Child, NewChild>): Lens<Main, NewChild> {
        return new Lens((m: Main) => l.get(this.get(m)), (m: Main, c: NewChild) => this.set(m, l.set(this.get(m), c)))
    }
    transform(fn: (oldChild: Child) => Child): (m: Main) => Main { return m => this.set(m, fn(this.get(m)))}
}