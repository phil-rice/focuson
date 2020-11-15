export class LoadAndCompileCache {
    private httploader: (url: string) => Promise<string>;
    private digester: (raw: string) => string;
    cache: Map<string, any>;
    private compiler: (raw: string) => any;

    /** loader takes a url and returns a promise. The sha of the string is checked against the final segment of the url when loaded,  then evaled
     * The results are remembered in the cache*/
    constructor(httploader: (url: string) => Promise<string>, digester: (raw: string) => string, compiler: undefined | ((raw: string) => any)) {
        if (!digester) throw Error('Digester not defined')
        if (!httploader) throw Error('httploader not defined')
        this.httploader = httploader
        this.digester = digester
        this.compiler = compiler ? compiler : eval
        this.cache = new Map()
    }

    findAllRenderUrls(jsonBlob: any) {    //terribly implemented: should make more efficient
        var result: string[] = []
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

    getFromCache(url: string) {
        if (this.cache.has(url)) return this.cache.get(url)
        throw Error(`The cache does not know how to render ${url}\nLegal values are ${Array.from(this.cache.keys()).sort()}`)
    }

    loadifNeededAndCheck(url: string) {
        if (this.cache.has(url)) {
            return Promise.resolve(this.cache.get(url))
        }
        // @ts-ignore
        let lastSegment: string = /([^/]+)$/.exec(url)[1]
        if (lastSegment == null) throw Error(`Last segment of ${url} cannot be extracted`)

        return this.httploader(url).then(string => {
            var digest = this.digester(string) + ""
            if (digest !== lastSegment) throw Error(`Digest mismatch for ${url} actually had ${digest}.\nThe string was ${string}`)
            try {
                var result = this.compiler(string)
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