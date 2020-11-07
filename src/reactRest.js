class ReactRest {
    /** Create will usually be React.createElement. Using it via dependency inject to allow testing more easily, and because that decouples this from React
     * classMap will turn a url into a promise of a string.
     *    The last segment of the url should be the sha256 of the string, and this will be checked*/
    constructor(create, classMap, knownUrls) {
        this.create = create
        this.classMap = classMap
        this.knownUrls = knownUrls == null ? [] : knownUrls
    }

    withUrls(newUrls) {
        var newKnownUrls = Object.assign({}, this.knownUrls)
        newKnownUrls = Object.assign(newKnownUrls, newUrls)
        delete newKnownUrls._self
        return new ReactRest(this.create, this.classMap, newKnownUrls)
    }

    renderSelf(obj) {
        return this.renderUsing("_self", obj)
    }

    renderUrl(name, obj) {
        if (obj._render && name in obj._render) return obj._render[name]
        if (name in this.knownUrls) return this.knownUrls[name]
        throw `Cannot find renderUrl for  ${name}`
    }

    renderClass(url, obj) {
        if (this.classMap.hasOwnProperty(url)) return this.classMap[url]
        throw `Cannot render ${url}`
    }

    renderUsing(name, obj) {
        var renderUrl = this.renderUrl(name, obj)
        var renderClass = this.renderClass(renderUrl, obj)
        var newReact = this.withUrls(obj._render)
        return this.create(renderClass, {reactRest: newReact, data: obj})
    }
}
