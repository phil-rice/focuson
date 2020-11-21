import {LensContext} from "../optics/LensContext";
import {LoadAndCompileCache} from "./LoadAndCompileCache";

export interface MakeComponentFromServer<ReactElement> {<Domain extends DomainWithCache<ReactElement>, Main, T>(props: ComponentFromServerProperties<Domain, Main, T, ReactElement>): ReactElement}

export interface DomainWithCache<ReactElement> {
    componentCache: LoadAndCompileCache<MakeComponentFromServer<ReactElement>>
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

export function ComponentFromServer<Domain extends DomainWithCache<ReactElement>, Main, T, ReactElement>(properties: ComponentFromServerProperties<Domain, Main, T, ReactElement>): ReactElement {
    console.log("ComponentFromServer", properties)
    let renderUrl = findRenderUrl("_self", properties.context.json())
    let makeComponent: MakeComponentFromServer<ReactElement> = properties.context.domain.componentCache.getFromCache(renderUrl)
    return makeComponent(properties)
}

export interface ChildFromServerProperties<Domain extends DomainWithCache<Element>, Main, Parent, Child, Element> {
    context: LensContext<Domain, Element, Main, Parent>
    render: string
    childContext: LensContext<Domain, Element, Main, Child>
    [a: string]: any
}

export function ChildFromServer<Domain extends DomainWithCache<Element>, Main, Parent, Child, Element>(properties: ChildFromServerProperties<Domain, Main, Parent, Child, Element>): Element {
    let renderUrl = findRenderUrl(properties.render, properties.context.json())
    let makeComponent: MakeComponentFromServer<Element> = properties.childContext.domain.componentCache.getFromCache(renderUrl)
    return makeComponent({context: properties.childContext})
}
