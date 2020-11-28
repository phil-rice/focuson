import React from "react";
import { CpqProperties, CqpFilter } from "../CpqDomain";
import { Lens } from "@phil-rice/lens";


let filterToSelectedL = new Lens((c: CqpFilter) => c.selected, (c: CqpFilter, s: string | null) => ({ ...c, selected: s }));
function GearboxFilter<Main>(props: CpqProperties<Main, CqpFilter>) {
    let context = props.context;
    const onChange = (event: any) => context.setFrom(filterToSelectedL, event.target.value);
    let filterJson = context.json();
    let options = context.domain.makeOptions(filterJson.selected, context.json().legalValues);
    return (<div key={filterJson.filterName}>
        <p><span className="font-weight-bold">Filter:</span> {filterJson.filterName}</p>
        <select className="custom-select custom-select-md mb-3" onChange={event => onChange(event)} key={`select-${filterJson.filterName}`}>{options}</select>
    </div>);
}
