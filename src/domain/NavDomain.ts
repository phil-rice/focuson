import {RestProperties} from "../reactrest/ReactRestElements";
import React from "react";
import {GameData} from "./GameDomain";

export interface NavProperties {
    loadUrlAndPutInElement: (domainName: string, url: string, name: string) => void}

export type NavRest<Parent, Child> = RestProperties<React.ReactElement, NavDomain, GameData, Parent, Child>

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

export class NavDomain {}

