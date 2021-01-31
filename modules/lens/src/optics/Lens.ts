//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {checkIsFunction, Tuple} from "../utils";
import {LensContext} from "./LensContext";

export type Getter<Main, Child> = (main: Main) => Child
export type Setter<Main, Child> = (main: Main, child: Child) => Main

export interface LensFactory<Main, Child> {
    get: Getter<Main, Child>,
    set?: Setter<Main, Child>
}

export function lens<Main, Child>(get: Getter<Main, Child>, set?: Setter<Main, Child>, description?: string): Lens<Main, Child> {
    checkIsFunction(get)
    if (set) checkIsFunction(set)
    return new Lens(get, set ? set : (m, c) => {throw Error('Cannot call set on this lens')}, description)
}
export function toLens<Main, Child>(f: LensFactory<Main, Child>): Lens<Main, Child> {
    return lens(f.get, f.set)
}

//Why do lens have a description? Answer to make the testing and debugging easier.
export class Lens<Main, Child> {
    static identity<M>(): Lens<M, M> {return lens(m => m, (m, c) => c, 'identity')}
    static constant<M, T>(t: T): Lens<M, T> {return lens(m => t, (m, c) => m, `constant(${t})`)}
    static nth<T>(n: number): Lens<T[], T> {
        function check<X>(verb: string, length: number) { {if (n > length) throw Error(`Cannot Lens.nth(${n}).${verb}. arr.length is ${length}`)} }
        if (n < 0) throw Error(`Cannot set Lens.nth with negative number [${n}]`)
        return lens(arr => {
                check('get', arr.length);
                return arr[n]
            },
            (main, value) => {
                check('set', main.length)
                let result = main.slice();
                result[n] = value;
                return result
            }, `[${n}]`)
    }
    static tupleLens<Main, C1, C2>(lens1: Lens<Main, C1>, lens2: Lens<Main, C2>): Lens<Main, Tuple<C1, C2>> {
        let get: Getter<Main, Tuple<C1, C2>> = main => ({one: lens1.get(main), two: lens2.get(main)})
        let set: Setter<Main, Tuple<C1, C2>> = (main, tuple) => lens1.set(lens2.set(main, tuple.two), tuple.one)
        return new Lens(get, set, `tuple(${lens1.description},${lens2.description}`)
    }

    description: string
    get: (m: Main) => Child;
    set: (m: Main, newChild: Child) => Main;

    setTo(newChild: Child): (m: Main) => Main {return m => this.set(m, newChild)}
    constructor(get: (m: Main) => Child, set: (m: Main, newChild: Child) => Main, description?: string) {
        this.get = get;
        this.set = set;
        this.description = description ? description : "<undefined>"
    }
    toString() {return `Lens(${this.description})`}

    // static setTwo<Main, C1, C2>(lens1: Lens<Main, C1>, lens2: Lens<Main, C2>): (c1: C1, c2: C2) => (main: Main) => Main {
    //     return (c1, c2) => (main: Main) => lens1.set(lens2.set(main, c2), c1)
    // }

    static transform2<Main, C1, C2>(lens1: Lens<Main, C1>, lens2: Lens<Main, C2>) {
        return (fn: (c1: C1, c2: C2) => Tuple<C1, C2>) => {
            return (main: Main) => {
                let tuple = fn(lens1.get(main), lens2.get(main))
                return lens1.set(lens2.set(main, tuple.two), tuple.one)
            }
        }
    }


    andThen<NewChild>(l: Lens<Child, NewChild>): Lens<Main, NewChild> {
        return new Lens(
            (m: Main) => l.get(this.get(m)),
            (m: Main, c: NewChild) => this.set(m, l.set(this.get(m), c)), this.description + "/" + l.description)
    }
    transform(fn: (oldChild: Child) => Child): (m: Main) => Main { return m => this.set(m, fn(this.get(m)))}
    transformInSitu(m: Main, fn: (oldChild: Child) => Child) { return this.set(m, fn(this.get(m)))}

    field = <K extends keyof Child>(fieldName: K): Lens<Child, Child[K]> => new Lens<Child, Child[K]>(m => m[fieldName], (m, c) => {
        let result = Object.assign({}, m)
        result[fieldName] = c
        return result
    }, fieldName.toString())

    then = <K extends keyof Child>(fieldName: K): Lens<Main, Child[K]> => this.andThen(this.field(fieldName));

    withDescription(description: string) {return new Lens(this.get, this.set, description) }
    static build<Main>(description: string) {return Lens.identity<Main>().withDescription(description)}
}

export let focusOnNth = <Domain, Main, T>(context: LensContext<Domain, Main, T[]>, n: number) => context.withChildLens(Lens.nth(n));

