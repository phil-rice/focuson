import {RestProperties} from "../reactrest/ReactRestElements";
import React from "react";
import {Domain} from "./Domain";


export type CPQRest<Parent, Child> = RestProperties<React.ReactElement, CpqDomain, CPQ, Parent, Child>

export interface Link {
    href: string
}
export interface SelfLink {
    _links: { _self: Link }
}
export interface SelfRender {
    _render: { _self: string }

}
export interface CPQ extends SelfLink, SelfRender {
    pageIndex: number
    pageCount: number
    makeFilter: CPQFilter
    modelFilter: CPQFilter
}

export interface CPQFilter extends SelfRender {
    filterName: string //this is a lookup into an internationalisation resource bundle
    selected: null | string
    legalValues: string[]

}

class CpqDomain {}

const example: CPQ = {
    "_links": {"_self": {"href": "api/filterList/filterList1"}},
    "_render": {"_self": "created/Cpq/someShaOfTheFilterListComponent"},
    "pageIndex": 0,
    "pageCount": 3,
    "makeFilter": {
        "_render": {"_self": "created/simpleFilter/someShaOfTheSimpleFilter"},
        "filterName": "filterlist.make",
        "selected": null,
        "legalValues": ["Audi", "BMW", "Tesla"]
    },
    "modelFilter": {
        "_render": {"_self": "created/simpleFilter/someShaOfTheSimpleFilter"},
        "filterName": "filterlist.model",
        "selected": null,
        "legalValues": ["Audi A10", "BMW series 6", "Tesla Roadster"]
    }
}
