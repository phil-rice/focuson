import React from "react";
import {LoadAndCompileCache} from "../componentFromServer/LoadAndCompileCache";
import {MakeComponentFromServer} from "../componentFromServer/ComponentFromServer";
import {LensProps} from "../optics/LensContext";


export type CpqProperties<Main, T> = LensProps<CpqDomain, React.ReactElement, Main, T>

export interface Link {href: string}
export interface SelfLink {_links: { _self: Link }}
export interface SelfRender {
    _render: { _self: string }
}
export interface CpqData extends SelfLink, SelfRender {filters: CqpFilter[]}

export interface CqpFilter extends SelfRender {
    filterName: string //this is a lookup into an internationalisation resource bundle
    selected: null | string
    legalValues: string[]
}

export class CpqDomain {
    componentCache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>
    constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>) {this.componentCache = componentCache;}
    makeOptions(selected: string | null, values: string[]) {
        let option = (value: string) => (selected === value) ?
            (<option key={value} selected>{value}</option>) :
            (<option key={value}>{value}</option>)
        return values.map(option)
    }
}

const example: CpqData = {
    "_links": {"_self": {"href": "api/filterList/filterList1"}},
    "_render": {"_self": "#Cpq/render#"},
    "filters": [
        {
            "_render": {"_self": "#SimpleFilter/render#"},
            "filterName": "filter.make",
            "selected": null,
            "legalValues": ["Audi", "BMW", "Tesla"]
        }, {
            "_render": {"_self": "#SimpleFilter/render#"},
            "filterName": "filter.model",
            "selected": null,
            "legalValues": ["Audi A10", "BMW series 6", "Tesla Roadster"]
        }, {
            "_render": {"_self": "#SimpleFilter/render#"},
            "filterName": "filter.transmission",
            "selected": null,
            "legalValues": ["Automatic", "Gearbox"]
        }, {
            "_render": {"_self": "#SimpleFilter/render#"},
            "filterName": "filter.fuelType",
            "selected": null,
            "legalValues": ["Petrol", "Diesel", "Electric", "Benzene"]
        }
    ]
}

