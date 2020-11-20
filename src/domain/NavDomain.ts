import {RestProperties} from "../reactrest/ReactRestElements";
import React from "react";
import {GameData} from "./GameDomain";

export interface NavProperties {

}

export type NavRest<Parent, Child> = RestProperties<React.ReactElement, NavDomain<any>, GameData, Parent, Child>

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

export class NavDomain <DomainMap>{
    loadUrlAndPutInElement: <K extends keyof DomainMap>(domainName: K, url: string, name: string) => void
    target: string

    constructor(loadUrlAndPutInElement: <K extends keyof DomainMap>(domainName: K, url: string, name: string) => void, target: string) {
        this.loadUrlAndPutInElement = loadUrlAndPutInElement
        this.target = target
    }
}

