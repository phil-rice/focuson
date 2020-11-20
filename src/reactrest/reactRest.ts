import {LoadAndCompileCache} from "./LoadAndCompileCache";
import {HasRestProperties, RestProperties} from "./ReactRestElements";
import {checkIsFunction} from "../utils";


export interface MakeRestElement<Element> {<Domain, Main, Parent, Child>(rest: RestProperties<Element, Domain, Main, Parent, Child>): (props: any) => Element}

export class ReactRest<Element> {
    private create: (clazz: any, props: any) => Element;
    private loadAndCompileCache: LoadAndCompileCache<MakeRestElement<Element>>;
    /** Create will usually be React.createElement. Using it via dependency inject to allow testing more easily, and because that decouples this from React
     * reactCache will turn a url into a string. It is 'expected' that this securely changes the url into a string (checking the sha) and has been preloaded because we can't do async in the rendering  */
    constructor(create: (clazz: any, props: any) => Element, loadAndCompileCache: LoadAndCompileCache<MakeRestElement<Element>>) {
        this.create = create
        this.loadAndCompileCache = loadAndCompileCache
    }

    loadAndRender<Main>(url: string, setJson: (m: Main) => void) {
        fetch(url).then(r => r.json()).then(json => this.loadAndCompileCache.loadFromBlob(json).then(() => setJson(json)))
    }

    /** The parent can be 'self' in the case of RestRoot. It has a lens in it that goes from the 'main json' to the 'bit we are interested in'*/
    renderSelf<Domain, Main, Parent, Child>(hasRest: HasRestProperties<Element, Domain, Main, Parent, Child>): Element {
        // console.log("renderself", hasRest)
        let rest = hasRest.rest
        let renderUrl = this.renderUrl("_self", rest.lens.get(rest.restRoot.mainJson))
        return this.renderUsingUrl(renderUrl, hasRest)
    }

    renderUrl(name: string, child: any): string {
        if (child._render && name in child._render) return child._render[name]
        console.log("cannot find renderurl", name, child)
        throw Error(`Cannot find renderUrl for  [${name}] in [${JSON.stringify(child, null, 2)}]`)
    }

    renderUsingUrl<Domain, Main, Parent, Child>(renderUrl: string, hasRest: HasRestProperties<Element, Domain, Main, Parent, Child>): Element {
        let rest = hasRest.rest
        let makeRest: MakeRestElement<Element> = this.loadAndCompileCache.getFromCache(renderUrl)
        let name = renderUrl.split("/").reverse()[1]
        let renderFn = makeRest(rest)
        // @ts-ignore
        renderFn.displayName = name
        checkIsFunction(renderFn)
        let element = this.create(renderFn, hasRest); //hasRest is passed because it may hold extra properties
        return element
    }
}



