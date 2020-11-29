import React from 'react';

import {setup} from './enzymeAdapterSetup';
import {shallow, ShallowWrapper} from "enzyme";

import {Lens, LensContext} from "@phil-rice/lens";
import {CpqData, CpqDomain} from "./CpqDomain";
import {Cpq} from "./render/Cpq";
import {SimpleFilter} from "./render/SimpleFilter";

setup()
let cpqJson: CpqData = {
    "_render": {"_self": "#Cpq/render#"},
    "price": "N/A",
    "filters": [
        {
            "_render": {"_self": "#SimpleFilter/render#"},
            "filterName": "filter.make",
            "selected": "BMW",
            "legalValues": ["Audi", "BMW", "Tesla"]
        }, {
            "_render": {"_self": "#SimpleFilter/render#"},
            "filterName": "filter.model",
            "selected": "BMW series 6",
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


function setJson(json: CpqData): void {throw new Error('should not be called')}

let cache: any = ''//this isn't used and it's ok if it throws errors as that will indicate test failuer
let domain = new CpqDomain(cache)
let context = LensContext.main <CpqDomain, CpqData>(domain, cpqJson, setJson, 'cpq')

function compare<Domain, Main, Data>(wrapper: ShallowWrapper<any, React.Component["state"], React.Component>, context: LensContext<Domain, Main, Data>, expectedLensDescription: string) {
    let props: any = wrapper.props()
    let childContext: LensContext<Domain, Main, Data> = props.context
    expect(childContext.domain).toBe(domain)
    expect(childContext.lens.description).toBe(expectedLensDescription)
    expect(childContext.main).toBe(context.main)
    expect(childContext.dangerouslySetMain).toBe(context.dangerouslySetMain)

}

describe("Code on demand CPQ", () => {
    describe("Cpq", () => {
        it("should render", () => {
            const cpq = shallow(<Cpq context={context}/>)
            expect(cpq.find('.summary').text()).toEqual('Price: N/A')
            let filters = cpq.find('ComponentFromServer');
            expect(filters).toHaveLength(4)
            console.log('filters', filters)
            filters.forEach((filter, i) => compare(filter, context, `cpq/filters/[${i}]`))
            // let componentServers = cpq.find('ComponentFromServer');
            // expect(componentServers).toHaveLength(1)
            // compare(componentServers.at(0), context, 'game/_embedded/board')
        })
    })
    describe("SimpleFilter", () => {
        it("should render", () => {
            const simpleFilter = shallow(<SimpleFilter context={context.focusOn('filters').withChildLens(Lens.nth(0))}/>)
            let select = simpleFilter.find('select')
            expect(select).toHaveLength(1)
            expect(select.props().value).toEqual("BMW")
        })
    })
})
