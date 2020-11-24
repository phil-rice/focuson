import {Lens, LensContext, LensProps} from "@phil-rice/lens"
import {LoadAndCompileCache, MakeComponentFromServer} from "@phil-rice/codeondemand";
import React from "react";


export type NavProperties<DomainMap, Main, T> = LensProps<NavDomain<DomainMap>, Main, T>

interface SelfRender {
    _render: { _self: string }
}

export interface NavData {
    "_render": { [x: string]: any }
    "groups": NavGroupData[]
}

export interface NavGroupData extends SelfRender {
    name: string
    "jsonFiles": string[]
}
export class NavDomain<DomainMap> {
    cache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>
    loadUrlAndPutInElement: <K extends keyof DomainMap>(domainName: K, url: string, name: string) => void
    target: string

    constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>, loadUrlAndPutInElement: <K extends keyof DomainMap>(domainName: K, url: string, name: string) => void, target: string) {
        this.cache = componentCache
        this.loadUrlAndPutInElement = loadUrlAndPutInElement
        this.target = target
    }
}


export function Nav<DomainMap, Main>(props: NavProperties<DomainMap, Main, NavData>) {
    console.log("Nav", props)
    let groups = props.context.json().groups.map((g: NavGroupData, i: number) => {
        let childContext: LensContext<NavDomain<DomainMap>, Main, NavGroupData> = props.context.focusOn('groups').withChildLens(Lens.nth(i));
        return (<NavGroup key={i} context={childContext}/>);
    })
    return (<ul key={'groups'}>{groups}</ul>)
}

function NavGroup<DomainMap, Main>(props: NavProperties<DomainMap, Main, NavGroupData>) {
    let name = props.context.json().name
    let group = props.context.json().jsonFiles.map((url: string, i: number) =>
        (<li key={url}><a onClick={() => {
            console.log("onclick", name, url)
            // @ts-ignore //TODO consider how to remove this... how do we check that the name is legit? Or do we care? because we have a run time check with message anyway...
            return props.context.domain.loadUrlAndPutInElement(name, url, 'root')
        }}>{url}</a></li>))
    return (<React.Fragment>
        <li key={'groupName'}>{props.context.json().name}</li>
        <ul key={'navGroup' + name}>{group}</ul>
    </React.Fragment>)

}
