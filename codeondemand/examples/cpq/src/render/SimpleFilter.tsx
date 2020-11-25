import React from "react";
import { CpqProperties, CqpFilter } from "../CpqDomain";



function SimpleFilter<Main>(props: CpqProperties<Main, CqpFilter>) {
    const onChange = (event: any) => { console.log("onChange.target", event.target.value) };
    let filterJson = props.context.json();
    let options = props.context.domain.makeOptions(filterJson.selected, props.context.json().legalValues);
    return (<div key={filterJson.filterName} className={filterJson.filterName}>
        <p><span className="font-weight-bold">Filter:</span> {filterJson.filterName}</p>
        <select className="custom-select custom-select-md mb-3" onChange={event => onChange(event)} key={`select-${filterJson.filterName}`}>{options}</select>
    </div>);

}
