//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {ErrorHandler} from "../errors/errrors";

export type Wrapper = <In, Out>(fn: (finp: In) => Out) => (actualIn: In) => Out
export type WrapperK = <In, Out>(fn: (finp: In) => Promise<Out>) => (actualIn: In) => Promise<Out>


export function combine(...wrappers: Wrapper[]): Wrapper {return wrappers.reduce((acc, v) => fn => v(acc(fn)))}
export function combineK(...wrappers: WrapperK[]): WrapperK { return wrappers.reduce((acc, v) => fn => v(acc(fn)))}


export interface PartialProfunctor {
    name: string
    pre: (msg: string, input: any) => void
    post: (msg: string, input: any, output: any) => void
}

export class NonFunctionalExecutorsForFunctions {
    errors(err: ErrorHandler, msg: string): Wrapper {
        return <In, Out>(fn: (fInp: In) => Out) => (input: In) => {try {return fn(input)} catch (e) {return err.handle(msg, e)}}
    }
    normals(par: PartialProfunctor, msg: string): Wrapper {
        return <In, Out>(fn: (fInp: In) => Out) => (input: In) => {
            par.pre(msg, input);
            let output = fn(input);
            par.post(msg, input, output);
            return output
        }
    }
}

export class NonFunctionalExecutorsForPromiseFunctions {
    errors(err: ErrorHandler, msg: string): WrapperK {
        return <In, Out>(fn: (fInp: In) => Promise<Out>) => (input: In) => {try {return fn(input).catch(e => err.handle(msg, e))} catch (e) {return err.handle(msg, e)}}
    }
    normals(par: PartialProfunctor, msg: string): WrapperK {
        return <In, Out>(fn: (fInp: In) => Promise<Out>) => (input: In) => {
            par.pre(msg, input);
            return fn(input).then(o => {
                par.post(msg, input, o);
                return o
            })
        }
    }
}
