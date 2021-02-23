//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {ChildFromServer, ComponentFromServer} from "./ComponentFromServer";
import {Lens, Lenses} from "@focuson/lens";
import {fromMap} from "@focuson/state";

// @ts-ignore
window.Lens = Lens
// @ts-ignore
window.Lenses = Lenses
// @ts-ignore
window.ComponentFromServer = ComponentFromServer
// @ts-ignore
window.ChildFromServer = ChildFromServer

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

export interface ILoadAndCompileCache<Result>{
    loadFromBlob(jsonBlob: any): Promise<Result[]>,
    getFromCache(url: string): Result
}

export class LoadAndCompileCache<Result> implements ILoadAndCompileCache<Result>{
    private httploader: (url: string) => Promise<string>;
    private checker: UrlAndValueChecker
    cache: Map<string, Result>;
    private compiler: ((raw: string) => Result)

    static create<ThingToLoad>(digestor: (raw: string) => string): LoadAndCompileCache<ThingToLoad> {
        let loader = (url: string) => fetch(url).then(response => response.text())
        return new LoadAndCompileCache<ThingToLoad>(loader, digestorChecker(digestor))
    }

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

    loadFromBlob(jsonBlob: any): Promise<Result[]> {
        var urls = this.findAllRenderUrls(jsonBlob)
        return  Promise.all(urls.map(url => this.loadifNeededAndCheck(url)))
    }

    getFromCache(url: string): Result { return fromMap(this.cache, url)}

    loadifNeededAndCheck(url: string): Promise<Result> {
        if (this.cache.has(url)) {
            // @ts-ignore safe because we just checked that it had the content in it
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