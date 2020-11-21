import React from "react";
import {CpqProperties, CqpFilter} from "../domain/CpqDomain";


function GearboxFilter<Main>(props: CpqProperties<Main, CqpFilter>) {
    const onChange = (event: any) => { console.log("onChange.target", event.target.value)};
    let filterJson = props.context.json();
    let options = props.context.domain.makeOptions(filterJson.selected, props.context.json().legalValues);
    return (<div key={filterJson.filterName}>
        Gearbox Filter
        <select onChange={event => onChange(event)}>{options}</select>
    </div>);
}
