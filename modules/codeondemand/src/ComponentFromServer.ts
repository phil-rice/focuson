//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {ILoadAndCompileCache, LoadAndCompileCache} from "./LoadAndCompileCache";
import {Lens, LensContext} from "@phil-rice/lens";


export function loadAndRenderIntoElement<ReactElement, Domain extends DomainWithCache<ReactElement>, Main>(domain: Domain, description: string, processContext: (c: LensContext<Domain, Main, Main>) => void): (url: string) => Promise<void> {
    return url => {
        console.log("fetching", url)
        return fetch(url).then(r => r.json()).then(json => {
            console.log('setting json', json)
            domain.cache.loadFromBlob(json).then(() => LensContext.setJsonForReact<Domain, Main>(domain, description, c => processContext(c))(json))
        })
    }
}

//Why does this have 'ReactElement': to avoid binding this project to react. This is the only bit that's used, and it's just 'the result', so it might as well be generic
interface PropsWithContextDomainCache<ReactElement, Main, T> {
    context: LensContext<DomainWithCache<ReactElement>, Main, T>
    [a: string]: any
}
interface PropsForChildWithContextDomainCache<ReactElement, Main, T, Child> extends PropsWithContextDomainCache<ReactElement, Main, T> {
    render: string
    lens: Lens<T, Child>
}
export interface DomainWithCache<ReactElement> {
    cache: ILoadAndCompileCache<MakeComponentFromServer<ReactElement>>,
    [a: string]: any
}


export interface MakeComponentFromServer<ReactElement> {<Main, T>(props: PropsWithContextDomainCache<ReactElement, Main, T>): ReactElement}

function findRenderUrl(name: string, child: any): string {
    if (child._render && name in child._render) return child._render[name]
    console.log("cannot find renderurl", name, child)
    throw Error(`Cannot find renderUrl for  [${name}] in [${JSON.stringify(child, null, 2)}]`)
}

export function ComponentFromServer<ReactElement, Main, T>(properties: PropsWithContextDomainCache<ReactElement, Main, T>): ReactElement {
    console.log("ComponentFromServer", properties)
    let renderUrl = findRenderUrl("_self", properties.context.json())
    let makeComponent: MakeComponentFromServer<ReactElement> = properties.context.domain.cache.getFromCache(renderUrl)
    console.log("makecomponent", makeComponent)
    let result = makeComponent(properties);
    console.log("madecomponent", result)
    return result
}


function setLensInProperties<ReactElement, Main, T, Child>(p: PropsWithContextDomainCache<ReactElement, Main, T>, lens: Lens<T, Child>): PropsWithContextDomainCache<ReactElement, Main, Child> {
    return ({...p, context: p.context.withChildLens(lens)})
}


export function ChildFromServer<ReactElement, Main, T, Child>(properties: PropsForChildWithContextDomainCache<ReactElement, Main, T, Child>): ReactElement {
    let json = properties.context.lens.get(properties.context.main)
    let renderUrl = findRenderUrl(properties.render, json)
    let makeComponent: MakeComponentFromServer<ReactElement> = properties.context.domain.cache.getFromCache(renderUrl)
    let newProperties = setLensInProperties(properties, properties.lens);
    console.log("ChildFromServer", newProperties)
    return makeComponent(newProperties)
}
