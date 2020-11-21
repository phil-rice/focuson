import React from "react";
import {LoadAndCompileCache} from "../reactrest/LoadAndCompileCache";
import {DomainWithCache, MakeComponentFromServer} from "../reactrest/ComponentFromServer";
import {LensProps} from "../optics/LensContext";


export type NavProperties<DomainMap, Main, T> = LensProps<NavDomain<DomainMap, React.ReactElement>, React.ReactElement, Main, T>

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

export class NavDomain<DomainMap, Element> implements DomainWithCache<Element> {
    componentCache: LoadAndCompileCache<MakeComponentFromServer<Element>>
    loadUrlAndPutInElement: <K extends keyof DomainMap>(domainName: K, url: string, name: string) => void
    target: string

    constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<Element>>, loadUrlAndPutInElement: <K extends keyof DomainMap>(domainName: K, url: string, name: string) => void, target: string) {
        this.componentCache = componentCache
        this.loadUrlAndPutInElement = loadUrlAndPutInElement
        this.target = target
    }
}

