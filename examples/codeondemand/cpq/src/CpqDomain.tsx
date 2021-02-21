//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {LensProps} from "../../../../modules/lens"; //changed from @phil-rice/lens;
import {LoadAndCompileCache, MakeComponentFromServer} from "../../../../modules/codeondemand"; //changed from @phil-rice/codeondemand;



export interface SelfRender {
    _render: { _self: string }
}
export interface CpqData extends SelfRender, Price {filters: CqpFilter[]}

interface Price {
    price: string
}

export interface CqpFilter extends SelfRender {
    filterName: string, //this is a lookup into an internationalisation resource bundle
    selected: null | string,
    legalValues: string[]
}

// export class CpqDomain {
//     cache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>
//     constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>) {this.cache = componentCache;}
//     makeOptions(selected: string | null, values: string[]) {
//         let option = (value: string) => (selected === value) ?
//             (<option key={value} selected>{value}</option>) :
//             (<option key={value}>{value}</option>)
//         return values.map(option)
//     }
// }

const example: CpqData = {
    "price": "$300/month",
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

