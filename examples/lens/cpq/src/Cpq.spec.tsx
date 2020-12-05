import React from 'react';

import {enzymeSetup} from './enzymeAdapterSetup';
import {mount} from "enzyme";
import {Cpq, CpqData, CpqDomain} from "./Cpq";
import {LensContext} from "@phil-rice/lens";

enzymeSetup()

let json : CpqData= {
    "make": {
        "filterName": "filtermake",
        "selected": "Tesla",
        "options": ["Tesla", "BMW", "Audi"]
    },
    "model": {
        "filterName": "filtermodel",
        "selected": "BMW series 6",
        "options": ["Audi A10", "BMW series 6", "Tesla Roadster"]
    },
    "upholstery": {
        "filterName": "filterupholstery",
        "selected": "Boring Cotton",
        "options": ["Black Techno Leather", "Boring Cotton"]
    },
    "externalPaint": {
        "filterName": "filterexternalPaint",
        "options": ["Exciting Red", "Boring Black", "Electric Blue"]
    },
    "leasePeriod": {
        "filterName": "filterleasePeriod",
        "options": ["12m", "24m", "36m", "48m"]
    }
}

let domain = new CpqDomain()
let context = LensContext.main<CpqDomain, CpqData>(domain, json, () => {throw Error("Shouldn't be called")}, 'cpq')

describe("Cpq", () => {

    it('renders the json passed to it', () => {
        const cpq = mount(<Cpq context={context}/>)

        expect(cpq.find(".simpleFilter")).toHaveLength(5)

        expect(cpq.find('#filtermake').props().value).toEqual(json.make.selected)
        expect(cpq.find('#filtermodel').props().value).toEqual(json.model.selected)
        expect(cpq.find('#filterupholstery').props().value).toEqual(json.upholstery.selected)
        expect(cpq.find('#filterexternalPaint').props().value).toEqual("")
        expect(cpq.find('#filterleasePeriod').props().value).toEqual("")
    });


})
