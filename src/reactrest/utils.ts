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

export type Getter<Main, Child> = (main: Main) => Child
export type Setter<Main, Child> = (main: Main, child: Child) => Main

export interface LensFactory<Main, Child> {
    get: Getter<Main, Child>,
    set?: Setter<Main, Child>
}

export function lens<Main, Child>(get: Getter<Main, Child>, set?: Setter<Main, Child>): Lens<Main, Child> {
    checkIsFunction(get)
    if (set) checkIsFunction(set)
    return new Lens(get, set ? set : (m, c) => {throw Error('Cannot call set on this lens')})
}
export function toLens<Main, Child>(f: LensFactory<Main, Child>): Lens<Main, Child> {
    return lens(f.get, f.set)
}


export class Lens<Main, Child> {
    static identity<M>(): Lens<M, M> {return lens(m => m, (m, c) => c)}
    static nth<T>(n: number): Lens<T[], T>{return lens(arr => arr[n], (main, value) => {let result = main.slice(); result[n] = value; return result})}
    get: (m: Main) => Child;
    set: (m: Main, newChild: Child) => Main;
    constructor(get: (m: Main) => Child, set: (m: Main, newChild: Child) => Main) {
        this.get = get;
        this.set = set;
    }

    andThen<NewChild>(l: Lens<Child, NewChild>): Lens<Main, NewChild> {
        return new Lens(
            (m: Main) => l.get(this.get(m)),
            (m: Main, c: NewChild) => this.set(m, l.set(this.get(m), c)))
    }
    transform(fn: (oldChild: Child) => Child): (m: Main) => Main { return m => this.set(m, fn(this.get(m)))}
}