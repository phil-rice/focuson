//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import React from 'react';

import {enzymeSetup} from './enzymeAdapterSetup';
import {mount} from "enzyme";
import {Cpq, CpqData} from "./Cpq";
import {lensState} from "@focuson/state";

enzymeSetup()

let json: CpqData = {
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

let state = lensState<CpqData>(json, () => {throw Error("Shouldn't be called")}, 'cpq')

describe("Cpq", () => {

    it('renders the json passed to it', () => {
        const cpq = mount(<Cpq state={state}/>)

        expect(cpq.find(".simpleFilter")).toHaveLength(5)

        expect(cpq.find('#filtermake').props().value).toEqual(json.make.selected)
        expect(cpq.find('#filtermodel').props().value).toEqual(json.model.selected)
        expect(cpq.find('#filterupholstery').props().value).toEqual(json.upholstery.selected)
        expect(cpq.find('#filterexternalPaint').props().value).toEqual("")
        expect(cpq.find('#filterleasePeriod').props().value).toEqual("")
    });


})
