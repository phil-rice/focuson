export interface PartialProfunctor {
    name: string
    pre: (msg: string, input: any) => void
    post: (msg: string, input: any, output: any) => void
}


export interface ErrorHandler {
    handle(msg: string, e: any): any
}
export class NullErrorHandler implements ErrorHandler {
    handle(msg: string, e: any): any {
        throw e;
    }
}
export class ConsoleLogErrorHandler implements ErrorHandler {
    handle(msg: string, e: any): any {
        console.log(msg, e)
        throw e;
    }
}
export type LogPrinter = (msg: string, inp: any, out: any) => void
export function ConsoleLogPrinter(msg: string, inp: any, out: any) {console.log(msg, inp, out)}
export function NullLogPrinter(msg: string, inp: any, out: any) {}

function logging(logPrinter: LogPrinter): PartialProfunctor {
    return {
        name: "logging",
        pre(msg) { },
        post(msg, input, output) { logPrinter(msg, input, output) }
    }
}

export class MetricsStore {
    counts = new Map

    occured(msg: string) {
        if (this.counts.has(msg)) {
            this.counts.set(msg, this.counts.get(msg) + 1)
        } else
            this.counts.set(msg, 1)
    }
}

function metrics(metricStore: MetricsStore): PartialProfunctor {
    return {
        name: "metrics",
        pre(msg) { },
        post(msg, input, output) { metricStore.occured(msg) }
    }
}
function debug(logPrinter: LogPrinter): PartialProfunctor {
    let debug = true
    return {
        name: "debug",
        pre(msg) { },
        post(msg, input, output) {if (debug) logPrinter(msg, input, output) }
    }
}

type Wrapper = <In, Out>(fn: (finp: In) => Out) => (actualIn: In) => Out
type WrapperK = <In, Out>(fn: (finp: In) => Promise<Out>) => (actualIn: In) => Promise<Out>

function combine(...wrappers: Wrapper[]) {
    return <In, Out>(fn: (finp: In) => Out) => {
        var result = fn
        wrappers.forEach(w => result = w(result)) //Would love to do with reduce...
        return result
    }

}
function combineK(...wrappers: WrapperK[]) {
    return <In, Out>(fn: (finp: In) => Promise<Out>) => {
        var result = fn
        wrappers.forEach(w => result = w(result)) //Would love to do with reduce...
        return result
    }

}
class NonFunctionalExecutorsForFunctions {
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


export class NonFunctionalsForFunction {
    executor: NonFunctionalExecutorsForFunctions = new NonFunctionalExecutorsForFunctions()
    metrics: PartialProfunctor;
    logger: PartialProfunctor
    private errorHandler: ErrorHandler;
    private debug: PartialProfunctor;
    constructor(metricsStore: MetricsStore, errorHandler: ErrorHandler, logPrinter: LogPrinter) {
        this.errorHandler = errorHandler;
        this.metrics = metrics(metricsStore)
        this.logger = logging(logPrinter)
        this.debug = debug(logPrinter)
    }

    addLogging(msg: string): Wrapper {return this.executor.normals(this.logger, msg)}
    addMetrics(msg: string): Wrapper { return this.executor.normals(this.metrics, msg)}
    addErrors(msg: string): Wrapper {return this.executor.errors(this.errorHandler, msg)}
    addDebug(msg: string): Wrapper {return this.executor.normals(this.debug, msg)}

    addAll(msg: string): Wrapper {return combine(this.addLogging(msg), this.addMetrics(msg), this.addErrors(msg), this.addDebug(msg))}

}


class NonFunctionalExecutorsForPromiseFunctions {
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


export class NonFunctionalsForPromiseFunctions {
    executor: NonFunctionalExecutorsForPromiseFunctions = new NonFunctionalExecutorsForPromiseFunctions()
    metrics: PartialProfunctor;
    private errorHandler: ErrorHandler;
    private logger: PartialProfunctor;
    private debug: PartialProfunctor;
    constructor(metricsStore: MetricsStore, errorHandler: ErrorHandler, logPrinter: LogPrinter) {
        this.errorHandler = errorHandler;
        this.metrics = metrics(metricsStore)
        this.logger = logging(logPrinter)
        this.debug = debug(logPrinter)
    }

    addLogging(msg: string): WrapperK {return this.executor.normals(this.logger, msg)}
    addMetrics(msg: string): WrapperK { return this.executor.normals(this.metrics, msg)}
    addErrors(msg: string): WrapperK {return this.executor.errors(this.errorHandler, msg)}
    addDebug(msg: string): WrapperK {return this.executor.normals(this.debug, msg)}

    addAll(msg: string): WrapperK {return combineK(this.addLogging(msg), this.addMetrics(msg), this.addErrors(msg), this.addDebug(msg))}

}