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
