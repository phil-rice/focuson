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