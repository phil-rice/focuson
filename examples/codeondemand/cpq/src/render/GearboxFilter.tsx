//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import React from "react";
import { CpqProperties, CqpFilter } from "../CpqDomain";
import { Lens } from "@phil-rice/lens";


export function GearboxFilter<Main>({context}: CpqProperties<Main, CqpFilter>) {
    const onChange = (event: any) => context.focusOn('selected').setJson(event.target.value);
    let filterJson = context.json();
    let options = context.domain.makeOptions(filterJson.selected, context.json().legalValues);
    return (<div key={filterJson.filterName} className="gearboxFilterContainer">
        <p><span className="font-weight-bold">Filter:</span> {filterJson.filterName}</p>
        <select className="gearboxFilter" onChange={event => onChange(event)} key={`select-${filterJson.filterName}`}>{options}</select>
    </div>);
}
