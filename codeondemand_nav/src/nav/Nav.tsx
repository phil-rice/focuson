import {Lens, LensProps} from "@phil-rice/lens"
import {LoadAndCompileCache, MakeComponentFromServer} from "@phil-rice/codeondemand";
import React from "react";


export type NavProperties<Main, T> = LensProps<NavDomain, Main, T>

interface SelfRender {
    _render: { _self: string }
}

export interface NavData {
    "groups": NavGroupData[]
}

export interface NavGroupData extends SelfRender {
    name: string
    "jsonFiles": string[]
}
export class NavDomain {
    setJson: (url: string) => Promise<void>
    constructor(setJson: (url: string) => Promise<void>) {this.setJson = setJson}
}


export function Nav<Main>(props: NavProperties<Main, NavData>) {
    console.log("Nav", props)
    let groups = props.context.json().groups.map((g: NavGroupData, i: number) => {
        return (<NavGroup key={i} context={props.context.focusOn('groups').withChildLens(Lens.nth(i))}/>);
    })
    return (<ul key={'groups'}>{groups}</ul>)
}

function NavGroup<Main>(props: NavProperties<Main, NavGroupData>) {
    let name = props.context.json().name
    let group = props.context.json().jsonFiles.map((url: string, i: number) =>
        (<li key={url}><a onClick={() => {
            console.log("onclick", name, url)
            return props.context.domain.setJson(url)
        }}>{url}</a></li>))
    return (<React.Fragment>
        <li key={'groupName'}>{props.context.json().name}</li>
        <ul key={'navGroup' + name}>{group}</ul>
    </React.Fragment>)

}
