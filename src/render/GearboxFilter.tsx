import React from "react";
import {CpqDomain, CpqProperties, CqpFilter} from "../domain/CpqDomain";
import {Lens} from "../optics/optics";


let filterToSelectedL = new Lens((c: CqpFilter) => c.selected, (c: CqpFilter, s: string | null) => ({...c, selected: s}));
function GearboxFilter<Main>(props: CpqProperties<Main, CqpFilter>) {
    let context = props.context;
    const onChange = (event: any) => context.setFrom(filterToSelectedL, event.target.value);
    let filterJson = context.json();
    let options = context.domain.makeOptions(filterJson.selected, context.json().legalValues);
    return (<div key={filterJson.filterName}>
        Gearbox Filter
        <select onChange={event => onChange(event)}>{options}</select>
    </div>);
}
