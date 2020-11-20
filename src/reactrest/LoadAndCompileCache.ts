import {Rest, RestChild} from "./ReactRestElements";
import {Lens} from "../utils";


// @ts-ignore
window.Rest = Rest
// @ts-ignore
window.RestChild = RestChild
// @ts-ignore
window.Lens = Lens

/** blows up if mismatch*/
export type UrlAndValueChecker = (url: string, value: string) => void

export function digestorChecker(digester: (raw: string) => string): UrlAndValueChecker {
    return (url, value) => {
        // @ts-ignore  because the very next line checks for null. In addition I don't think it can actually be null
        let lastSegment: string = /([^/]+)$/.exec(url)[1]
        if (lastSegment == null) throw Error(`Last segment of ${url} cannot be extracted`)
        var digest = digester(value) + ""
        if (digest !== lastSegment) throw Error(`Digest mismatch for ${url} actually had [${digest}] expected [${lastSegment}].\nThe string was ${value}`)
    }
}

export class LoadAndCompileCache<Result> {
    private httploader: (url: string) => Promise<string>;
    private checker: UrlAndValueChecker
    cache: Map<string, Result>;
    private compiler: ((raw: string) => Result)

    /** loader takes a url and returns a promise. The sha of the string is checked against the final segment of the url when loaded,  then evaled
     * The results are remembered in the cache*/
    constructor(httploader: (url: string) => Promise<string>, checker: UrlAndValueChecker, compiler?: ((raw: string) => Result)) {
        if (!checker) throw Error('Checker not defined')
        if (!httploader) throw Error('httploader not defined')
        this.httploader = httploader
        this.checker = checker
        this.compiler = compiler ? compiler : (s: string) => Function(s)()
        this.cache = new Map()
    }

    findAllRenderUrls(jsonBlob: any) {    //terribly implemented: should make more efficient
        var result: string[] = []
        if (jsonBlob === null) return result;
        if (Array.isArray(jsonBlob))
            jsonBlob.forEach(child => result = result.concat(this.findAllRenderUrls(child)))
        else if (typeof jsonBlob === 'object') {
            if (jsonBlob.hasOwnProperty("_render")) {
                for (var key in jsonBlob._render) {
                    result.push(jsonBlob._render[key])
                }
            }
            for (key in jsonBlob) {
                result = result.concat(this.findAllRenderUrls(jsonBlob[key]))
            }
        }
        return result
    }

    loadFromBlob(jsonBlob: any) {
        var urls = this.findAllRenderUrls(jsonBlob)
        return Promise.all(urls.map(url => this.loadifNeededAndCheck(url)))
    }

    getFromCache(url: string): Result {
        //@ts-ignore we can safely do this because we are actually checking.
        if (this.cache.has(url)) return this.cache.get(url)
        throw Error(`The cache does not know how to render ${url}\nLegal values are ${Array.from(this.cache.keys()).sort()}`)
    }

    loadifNeededAndCheck(url: string) {
        if (this.cache.has(url)) {
            return Promise.resolve(this.cache.get(url))
        }

        return this.httploader(url).then(string => {
            this.checker(url, string)
            try {
                let result = this.compiler(string)  //wanted to inject eval but https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval states that the behavior changes
                this.cache.set(url, result)
                return result
            } catch (e) {
                console.log("have an issue with code from the backend", string)
                console.log("error", e)
                throw e
            }
        })
    }
}