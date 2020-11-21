import React from "react";
import {CpqProperties, CqpFilter} from "../domain/CpqDomain";


function SimpleFilter<Main>(props: CpqProperties<Main, CqpFilter>) {
    const onChange = (event: any) => { console.log("onChange.target", event.target.value)};
    let filterJson = props.context.json();
    let options = props.context.domain.makeOptions(filterJson.selected, props.context.json().legalValues);
    return (<div key={filterJson.filterName} className={filterJson.filterName}><p>{filterJson.filterName}</p><select onChange={event => onChange(event)}>{options}</select></div>);

}
