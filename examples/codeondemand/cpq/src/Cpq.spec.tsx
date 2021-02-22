//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import React from 'react';

import {enzymeSetup} from './enzymeAdapterSetup';
import {shallow, ShallowWrapper} from "enzyme";

import {Lenses} from "@phil-rice/lens";
import {lensState, LensState} from "@phil-rice/state";
import {CpqData} from "./CpqDomain";
import {Cpq} from "./render/Cpq";
import {SimpleFilter} from "./render/SimpleFilter";

enzymeSetup()
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

let context = lensState(cpqJson, setJson, 'cpq')

function compare<Domain, Main, Data>(wrapper: ShallowWrapper<any, React.Component["state"], React.Component>, context: LensState<Main, Data>, expectedLensDescription: string) {
    let props: any = wrapper.props()
    let childContext: LensState<Main, Data> = props.context
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
        })
    })
    describe("SimpleFilter", () => {
        it("should render", () => {
            const simpleFilter = shallow(<SimpleFilter context={context.focusOn('filters').chainLens(Lenses.nth(0))}/>)
            let select = simpleFilter.find('select')
            expect(select).toHaveLength(1)
            expect(select.props().value).toEqual("BMW")
        })
    })
})
