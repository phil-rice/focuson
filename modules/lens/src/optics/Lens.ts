//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {checkIsFunction, Tuple2, Tuple3} from "../utils";
import {LensContext} from "./LensContext";

export function lens<Main, Child>(get: (main: Main) => Child, set?: (main: Main, newChild: Child) => Main, description?: string): Lens<Main, Child> {
    checkIsFunction(get)
    if (set) checkIsFunction(set)
    return new Lens(get, set ? set : (m, c) => {throw Error(`Cannot call set on this lens : ${description}`)}, description)
}

export const transformTwoValues = <Main, C1, C2>(lens1: Lens<Main, C1>, lens2: Lens<Main, C2>) => (fn1: (c1: C1, c2: C2) => C1, fn2: (c1: C1, c2: C2) => C2) => (main: Main): Main =>
    lens1.set(lens2.set(main, fn2(lens1.get(main), lens2.get(main))), fn1(lens1.get(main), lens2.get(main)))

export const updateTwoValues = <Main, C1, C2>(lens1: Lens<Main, C1>, lens2: Lens<Main, C2>) => (main: Main, c1: C1, c2: C2): Main =>
    lens1.set(lens2.set(main, c2), c1)

export const updateThreeValues = <Main, C1, C2, C3>(lens1: Lens<Main, C1>, lens2: Lens<Main, C2>, lens3: Lens<Main, C3>) =>
    (main: Main, c1: C1, c2: C2, c3: C3): Main => lens1.set(lens2.set(lens3.set(main, c3), c2), c1)


export class Lens<Main, Child> {
//Why do lens have a description? Answer to make the testing and debugging easier.
    description: string
    get: (m: Main) => Child;
    set: (m: Main, newChild: Child) => Main;

    constructor(get: (m: Main) => Child, set: (m: Main, newChild: Child) => Main, description?: string) {
        this.get = get;
        this.set = set;
        this.description = description ? description : "<undefined>"
    }

    chainWith<NewChild>(l: Lens<Child, NewChild>): Lens<Main, NewChild> {
        return new Lens(
            (m: Main) => l.get(this.get(m)),
            (m: Main, c: NewChild) => this.set(m, l.set(this.get(m), c)), this.description + "/" + l.description)
    }

    focusOn = <K extends keyof Child>(fieldName: K): Lens<Main, Child[K]> => this.chainWith(Lenses.field<Child, K>(fieldName));

    transform(fn: (oldChild: Child) => Child): (m: Main) => Main { return m => this.set(m, fn(this.get(m))) }

    withDescription(description: string) {return new Lens(this.get, this.set, description)}

    toString() { return `Lens(${this.description})` }

    combineWith = <Child2>(other: Lens<Main, Child2>) => new Lens<Main, Tuple2<Child, Child2>>(
        main => ({one: this.get(main), two: other.get(main)}),
        (main, tuple) => this.set(other.set(main, tuple.two), tuple.one))

    combineWithTwoOtherLens = <Child1, Child2>(lens1: Lens<Main, Child1>, lens2: Lens<Main, Child2>) => new Lens<Main, Tuple3<Child, Child1, Child2>>(
        main => ({one: this.get(main), two: lens1.get(main), three: lens2.get(main)}),
        (main, tuple) => this.set(lens1.set(lens2.set(main, tuple.three), tuple.two), tuple.one))
}


export class Lenses {
    static build<Main>(description: string) {return Lenses.identity<Main>().withDescription(description)}

    static field = <Main, K extends keyof Main>(fieldName: K): Lens<Main, Main[K]> => lens(m => m[fieldName], (m, c) => {
        let result = Object.assign({}, m)
        result[fieldName] = c
        return result
    }, fieldName.toString())

    static identity<M>(): Lens<M, M> { return lens(m => m, (m, c) => c, 'identity') }

    static constant<M, T>(t: T): Lens<M, T> { return lens(m => t, (m, c) => m, `constant(${t})`) }

    static nth<T>(n: number): Lens<T[], T> {
        function check<X>(verb: string, length: number) {
            if (n > length) throw Error(`Cannot Lens.nth(${n}).${verb}. arr.length is ${length}`)
        }

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
}
