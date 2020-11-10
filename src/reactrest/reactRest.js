import React from 'react';

export class ReactRestCache {

    /** loader takes a url and returns a promise. The sha of the string is checked against the final segment of the url when loaded,  then evaled
     * The results are remembered in the cache*/
    constructor(httploader, digester) {
        if (!digester) throw Error('Digester not defined')
        if (!httploader) throw Error('httploader not defined')
        this.httploader = httploader
        this.digester = digester
        this.cache = {}
    }


    findAllRenderUrls(jsonBlob) {    //terribly implemented: should make more efficient
        var result = []
        if (typeof jsonBlob === 'array')
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

    loadFromBlob(jsonBlob) {
        var urls = this.findAllRenderUrls(jsonBlob)
        return Promise.all(urls.map(url => this.loadifNeededAndCheck(url)))
    }

    getFromCache(url) {
        return this.cache[url]
    }

    loadifNeededAndCheck(url) {
        if (this.cache.hasOwnProperty(url)) {
            return Promise.resolve(this.cache[url])
        }
        var lastSegment = /([^/]+)$/.exec(url)[1]

        return this.httploader(url).then(string => {
            var digest = this.digester(string) + ""
            if (digest !== lastSegment) throw Error(`Digest mismatch for ${url} actually had ${digest}`)
            try {
                var result = eval(string)
                this.cache[url] = result
                return result
            } catch (e) {
                console.log("have an issue with code from the backend", string)
                console.log("error", e)
                throw e
            }
        })
    }
}


export class ReactRest {
    /** Create will usually be React.createElement. Using it via dependency inject to allow testing more easily, and because that decouples this from React
     * reactCache will turn a url into a string. It is 'expected' that this securely changes the url into a string (checking the sha) and has been preloaded because we can't do async in the rendering  */
    constructor(create, reactRestCache, knownUrls) {
        this.create = create
        this.reactRestCache = reactRestCache
        this.knownUrls = knownUrls == null ? [] : knownUrls
    }

    withUrls(newUrls) {
        var newKnownUrls = Object.assign({}, this.knownUrls)
        newKnownUrls = Object.assign(newKnownUrls, newUrls)
        delete newKnownUrls._self
        return new ReactRest(this.create, this.reactRestCache, newKnownUrls)
    }

    renderSelf(obj) {
        return this.renderUsing("_self", obj)
    }

    renderUrl(name, obj) {
        if (obj._render && name in obj._render) return obj._render[name]
        if (name in this.knownUrls) return this.knownUrls[name]
        throw `Cannot find renderUrl for  ${name}`
    }

    renderUsing(name, obj) {
        var renderUrl = this.renderUrl(name, obj)
        var renderClass = this.reactRestCache.getFromCache(renderUrl)
        var newReact = this.withUrls(obj._render)
        return this.create(renderClass, {reactRest: newReact, data: obj})
    }
}


export const RestContext = React.createContext()

// export function Rest({children}) {
//     return <RestContext.Provider value={'dark'}>{children}</RestContext.Provider>
// }

export function Rest(props) {
    // let value = {reactRest: props.reactRest, json: props.json}
    return (<RestContext.Provider value={{reactRest: props.reactRest, json: props.json}}>
        {props.reactRest.renderSelf(props.json)}
    </RestContext.Provider>)
}

export function RestChild(props) {
    return (<RestContext.Consumer>{context => {
        console.log("RestChild/context", context)
        let reactRest = context.reactRest
        let json = context.json
        console.log("RestChild", reactRest, json)
        let path = props.path
        console.log("path", path)
        let data = path.split('.').reduce((o, i) => o[i], json)
        console.log("data", data)
        let e = reactRest.renderSelf(data)
        return e
    }}</RestContext.Consumer>)
}

// export class RestChild extends React.Component {
//     constructor(props) {
//         super(props);
//         this.restReact= this.context.reactRest
//         this.path = props.path
//         console.log("RestChild/value", this.props)
//         console.log("RestChild/props", this.props)
//         console.log("RestChild/path", this.path)
//         this.data = this.path.split('.').reduce((o, i) => o[i], props.data)
//         console.log("RestChild/data", this.data)
//         this.restReact = props.restReact
//     }
//
//     render() {
//         return this.restReact.renderSelf(this.data)
//     }
//
// }
