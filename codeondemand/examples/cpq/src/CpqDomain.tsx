import {LensProps} from "@phil-rice/lens";
import {LoadAndCompileCache, MakeComponentFromServer} from "@phil-rice/codeondemand";

export type CpqProperties<Main, T> = LensProps<CpqDomain, Main, T>

export interface Link {href: string}
export interface SelfRender {
    _render: { _self: string }
}
export interface CpqData extends SelfRender {filters: CqpFilter[]}

export interface CqpFilter extends SelfRender {
    filterName: string, //this is a lookup into an internationalisation resource bundle
    selected: null | string,
    legalValues: string[]
}

export class CpqDomain {
    cache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>
    constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>) {this.cache = componentCache;}
    makeOptions(selected: string | null, values: string[]) {
        let option = (value: string) => (selected === value) ?
            (<option key={value} selected>{value}</option>) :
            (<option key={value}>{value}</option>)
        return values.map(option)
    }
}

const example: CpqData = {
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

