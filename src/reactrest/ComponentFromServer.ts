import {LensContext} from "../optics/LensContext";
import {LoadAndCompileCache} from "./LoadAndCompileCache";

export interface MakeComponentFromServer<Element> {<Domain extends DomainWithCache<Element>, Main, T>(props: ComponentFromServerProperties<Domain, Main, T, Element>): Element}

export interface DomainWithCache<Element> {
    componentCache: LoadAndCompileCache<MakeComponentFromServer<Element>>
}

export interface ComponentFromServerProperties<Domain extends DomainWithCache<Element>, Main, T, Element> {
    context: LensContext<Domain, Element, Main, T>
    [a: string]: any
}

function findRenderUrl(name: string, child: any): string {
    if (child._render && name in child._render) return child._render[name]
    console.log("cannot find renderurl", name, child)
    throw Error(`Cannot find renderUrl for  [${name}] in [${JSON.stringify(child, null, 2)}]`)
}

export function ComponentFromServer<Domain extends DomainWithCache<Element>, Main, T, Element>(properties: ComponentFromServerProperties<Domain, Main, T, Element>): Element {
    let renderUrl = findRenderUrl("_self", properties.context.json())
    let makeComponent: MakeComponentFromServer<Element> = properties.context.domain.componentCache.getFromCache(renderUrl)
    return makeComponent(properties)
}
