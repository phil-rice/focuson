import {NonFunctionalsForFunction, NonFunctionalsForPromiseFunctions} from "./nonFunctionals";
import {fromMap} from "../utils";
import {ErrorHandler} from "../errors/errrors";
import {LogPrinter} from "../logging/loggingProfunctor";
import {MetricsStore} from "../metrics/metrics";

interface ErrorReport {
    msg: string
    e: any
}
class RememberErrorHandler implements ErrorHandler {
    remembered: ErrorReport[] = []
    handle(msg: string, e: any) {
        this.remembered.push({msg: msg, e: e})
        throw e
    }
}
interface RememberedLogs {
    msg: string
    inp: any
    out: any
}
function rememberLogger(remember: RememberedLogs[]): LogPrinter {
    return (msg, inp, out) => remember.push({msg: msg, inp: inp, out: out})
}

function f<Inp, Out>(expected: Inp, response: () => Out) {
    return (inp: Inp) => {
        expect(inp).toEqual(expected)
        return response()
    }
}

describe('Non Functional Wrapper', () => {
    let error = Error('some error');
    function setup<In, Out>(msg: string, inp: In, out: Out): (fn: (nonFunctionals: NonFunctionalsForFunction, metricStore: MetricsStore, errorHandler: RememberErrorHandler, logs: RememberedLogs[], wrappedFn: (inp: In) => Out, wrappedErrorFn: (inp: In) => Out) => void) => void {
        return fn => {
            let metricStore = new MetricsStore()
            let errorHandler = new RememberErrorHandler()
            let logs: RememberedLogs[] = []
            let nonFunctionals = new NonFunctionalsForFunction(metricStore, errorHandler, rememberLogger(logs))
            let wrappedFn = nonFunctionals.addAll(msg)(f(inp, () => out))
            let wrapperErrorFn = nonFunctionals.addAll("someMsg")(f(inp, () => {throw error}));
            fn(nonFunctionals, metricStore, errorHandler, logs, wrappedFn, wrapperErrorFn)
        }
    }

    describe("ErrorHandler", () => {
        it('should return the delegate result if no errors', () => {
            setup("someMessage", "in", "out")((nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn) => {
                expect(wrappedFn("in")).toEqual("out")
            })
        });

        it('should return whatever is coming from the error handler, and pass the message and the error to the handler', () => {
            setup("someMessage", "in", "out")((nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn) => {
                expect(() => wrapperErrorFn("in")).toThrow(error)
                expect(errorHandler.remembered).toEqual([{msg: "someMsg", e: error}])
            })
        });

    })

    describe("Metrics", () => {
        it('should return the delegate result, and record the metric', () => {
            setup("someMessage", "in", "out")((nonFunctionals, metricsStore, logs, errorHandler, wrappedFn, wrapperErrorFn) => {
                expect(wrappedFn("in")).toEqual("out")
                expect(metricsStore.counts.get("someMessage")).toEqual(1)
            })
        });
        it('should throw the same exception if there is an exception, and not record (for now)', () => {
            setup("someMessage", "in", "out")((nonFunctionals, metricsStore, logs, errorHandler, wrappedFn, wrapperErrorFn) => {
                expect(() => wrapperErrorFn("in")).toThrow(error)
                expect(metricsStore.counts.has("someMessage")).toEqual(false)
            })
        });
    })
})


describe('Non Functional Promise Wrapper', () => {
    let error = Error('some error');
    function setup<In, Out, X>(msg: string, inp: In, out: Out): (fn: (nonFunctionals: NonFunctionalsForPromiseFunctions, metricStore: MetricsStore, errorHandler: RememberErrorHandler, logs: RememberedLogs[], wrappedFn: (inp: In) => Promise<Out>, wrappedErrorFn: (inp: In) => Promise<Out>, wrappedErrorInPromiseFn: (inp: In) => Promise<Out>) => X) => X {
        return fn => {
            let metricStore = new MetricsStore()
            let errorHandler = new RememberErrorHandler()
            let logs: RememberedLogs[] = []
            let nonFunctionals = new NonFunctionalsForPromiseFunctions(metricStore, errorHandler, rememberLogger(logs))
            let wrappedFn = nonFunctionals.addAll(msg)(f(inp, () => Promise.resolve(out)))
            let wrapperErrorFn = nonFunctionals.addAll("someMsg")(f<In, Promise<Out>>(inp, () => {throw error}));
            let wrappedErrorInPromiseFn = nonFunctionals.addAll("someMsg")(f(inp, () => Promise.reject(error)));

            return fn(nonFunctionals, metricStore, errorHandler, logs, wrappedFn, wrapperErrorFn, wrappedErrorInPromiseFn)
        }
    }

    describe("ErrorHandler", () => {
        it('should return the delegate result if no errors', async () => {
            return await setup("someMessage", "in", "out")(async (nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn, wrappedErrorInPromiseFn) => {
                return await expect(wrappedFn("in")).resolves.toEqual("out")
            })
        });

        it('should handle errors in the main code (before promise)', async () => {
            return setup("someMessage", "in", "out")((nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn, wrappedErrorInPromiseFn) => {
                expect(() => wrapperErrorFn("in")).toThrow(error)
                expect(errorHandler.remembered).toEqual([{msg: "someMsg", e: error}])
            })
        });
        it('should handle errors in the promise', async () => {
            return setup("someMessage", "in", "out")(async (nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn, wrappedErrorInPromiseFn) => {
                let actual = wrappedErrorInPromiseFn("in");
                await expect(actual).rejects.toThrow(error)
                await actual.catch(() => expect(errorHandler.remembered).toEqual([{msg: "someMsg", e: error}])
                )
            })
        });

    })

    it('should return the delegate result', () => {
        return setup("someMessage", "in", "out")(async (nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn, wrappedErrorInPromiseFn) => {
            let result = wrappedFn("in");
            return await expect(result).resolves.toEqual("out")
        })
    });
    it('shouldecord the metric', () => {
        return setup("someMessage", "in", "out")(async (nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn, wrappedErrorInPromiseFn) => {
            return await expect(wrappedFn("in").then(() => fromMap(metricsStore.counts, "someMessage"))).resolves.toEqual(1)
        })
    });
    it('should throw the same exception if there is an exception, and not record (for now), error in main body ', () => {
        return setup("someMessage", "in", "out")(async (nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn, wrappedErrorInPromiseFn) => {
            await expect(() => wrapperErrorFn("in")).toThrow(error)
            return expect(metricsStore.counts.has("someMessage")).toEqual(false)
        })
    });
    it('should throw the same exception if there is an exception, and not record (for now), error in promise ', () => {
        return setup("someMessage", "in", "out")(async (nonFunctionals, metricsStore, errorHandler, logs, wrappedFn, wrapperErrorFn, wrappedErrorInPromiseFn) => {
            await expect(() => wrappedErrorInPromiseFn("in")).rejects.toThrow(error)
            return expect(metricsStore.counts.has("someMessage")).toEqual(false)
        })
    });
})
