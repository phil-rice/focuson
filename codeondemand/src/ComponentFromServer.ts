import {LoadAndCompileCache} from "./LoadAndCompileCache";
import {Lens} from "@phil-rice/lens/src/optics/optics";

//Why is this like this? I could get away with Domain extends... in my usage, but I use this a lot, and it would quickly get messy. This is messy, but just in one place
//Why does this have 'ReactElement': to avoid binding this project to react. This is the only bit that's used, and it's just 'the result', so it might as well be generic
interface PropsWithContextDomainCache<ReactElement, Main, T> {
    context: {
        main: Main
        lens: Lens<Main, T>
        domain: { cache: LoadAndCompileCache<MakeComponentFromServer<ReactElement>>, [a: string]: any },
        [a: string]: any
    }
    [a: string]: any
}
interface PropsForChildWithContextDomainCache<ReactElement, Main, T, Child> extends PropsWithContextDomainCache<ReactElement, Main, T> {
    render: string
    lens: Lens<T, Child>
}

export interface MakeComponentFromServer<ReactElement> {<Domain, Main, T>(props: PropsWithContextDomainCache<ReactElement, Main, T>): ReactElement}

function findRenderUrl(name: string, child: any): string {
    if (child._render && name in child._render) return child._render[name]
    console.log("cannot find renderurl", name, child)
    throw Error(`Cannot find renderUrl for  [${name}] in [${JSON.stringify(child, null, 2)}]`)
}

export function ComponentFromServer<ReactElement, Main, T, >(properties: PropsWithContextDomainCache<ReactElement, Main, T>): ReactElement {
    console.log("ComponentFromServer", properties)
    let renderUrl = findRenderUrl("_self", properties.context.json())
    let makeComponent: MakeComponentFromServer<ReactElement> = properties.context.domain.componentCache.getFromCache(renderUrl)
    return makeComponent(properties)
}


//Why not do this with lens? answer is that lens return the same thing. This is returning a new type of thing
//I might need a way to be able to express this... but I think typescript's type system is too weak
function setLens<ReactElement, Main, T, Child>(c: PropsWithContextDomainCache<ReactElement, Main, T>, lens: Lens<T, Child>): PropsWithContextDomainCache<ReactElement, Main, Child> {
    return ({...c, context: {...c.context, lens: c.context.lens.andThen(lens)}})
}

export function ChildFromServer<ReactElement, Main, T, Child>(properties: PropsForChildWithContextDomainCache<ReactElement, Main, T, Child>): ReactElement {
    let json = properties.context.lens.get(properties.context.main)
    let renderUrl = findRenderUrl(properties.render, json)
    let makeComponent: MakeComponentFromServer<ReactElement> = properties.childContext.domain.componentCache.getFromCache(renderUrl)
    return makeComponent(setLens(properties, properties.lens))
}
