//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {PartialProfunctor} from "../profunctor/Profunctor";

export type LogPrinter = (msg: string, inp: any, out: any) => void
export function ConsoleLogPrinter(msg: string, inp: any, out: any) {console.log(msg, inp, out)}
export function NullLogPrinter(msg: string, inp: any, out: any) {}

export function loggingProfunctor(logPrinter: LogPrinter): PartialProfunctor {
    return {
        name: "logging",
        pre(msg) { },
        post(msg, input, output) { logPrinter(msg, input, output) }
    }
}