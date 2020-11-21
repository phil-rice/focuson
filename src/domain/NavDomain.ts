import React from "react";
import {LoadAndCompileCache} from "../reactrest/LoadAndCompileCache";
import {ComponentFromServer, DomainWithCache, MakeComponentFromServer} from "../reactrest/ComponentFromServer";
import {LensContext, LensProps} from "../optics/LensContext";
import {fromObject, getElement} from "../utils";
import ReactDOM from "react-dom";


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

