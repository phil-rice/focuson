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

export interface Tuple<T1, T2> {
    one: T1,
    two: T2
}

export class Lens<Main, Child> {
    static identity<M>(): Lens<M, M> {return lens(m => m, (m, c) => c)}
    static nth<T>(n: number): Lens<T[], T> {
        return lens(arr => arr[n],
            (main, value) => {
                let result = main.slice();
                result[n] = value;
                return result
            })
    }
    get: (m: Main) => Child;
    set: (m: Main, newChild: Child) => Main;

    static tuple<Main, C1, C2>(lens1: Lens<Main, C1>, lens2: Lens<Main, C2>): Lens<Main, Tuple<C1, C2>> {
        let get = (main: Main) => ({one: lens1.get(main), two: lens2.get(main)})
        let set = (main: Main, tuple: Tuple<C1, C2>) => lens1.set(lens2.set(main, tuple.two), tuple.one)
        return new Lens(get, set)
    }

    static transform<Main, C1, C2>(lens1: Lens<Main, C1>, lens2: Lens<Main, C2>) {
        return (main: Main, c1: C1, c2: C2) => lens1.set(lens2.set(main, c2), c1)

    }
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
    transformInSitu(m: Main, fn: (oldChild: Child) => Child) { return this.set(m, fn(this.get(m)))}
    static build = <Main>(): LensBuilder<Main, Main> => new LensBuilder<Main, Main>(Lens.identity());
}

export class LensBuilder<Main, Child> extends Lens<Main, Child> {
    build: Lens<Main, Child>;
    constructor(lens: Lens<Main, Child>) {
        super(lens.get, lens.set);
        this.build = lens
    }
    field = <K extends keyof Child>(fieldName: K): Lens<Child, Child[K]> => new Lens<Child, Child[K]>(m => m[fieldName], (m, c) => {
        let result = Object.assign({}, m)
        result[fieldName] = c
        return result
    })
    then = <K extends keyof Child>(fieldName: K): LensBuilder<Main, Child[K]> => new LensBuilder<Main, Child[K]>(this.andThen(this.field(fieldName)));
    andThen<NewChild>(l: Lens<Child, NewChild>): Lens<Main, NewChild> { return new LensBuilder(super.andThen(l)) }
}
