import {RestProperties} from "../reactrest/ReactRestElements";
import React from "react";

export interface NavProperties<Main> {loadUrlAndPutInElement: (url: string, name: string)=> void}

export type NavRest<Parent, Child> = RestProperties<React.ReactElement, NavDomain, Parent, Child>

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

class NavDomain {}

