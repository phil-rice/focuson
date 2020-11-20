import React from "react";
import {CqpFilter, CqpRest} from "../domain/CpqDomain";


function SimpleFilter<Parent>(rest: CqpRest<Parent, CqpFilter>): (props: any) => React.ReactElement {
    const onChange = (event: any) => { console.log("onChange.target", event.target.value)};
    let filterJson = rest.json();
    return props => {
        let options = rest.domain().makeOptions(filterJson.selected, rest.json().legalValues);
        return (<div key={filterJson.filterName} className={filterJson.filterName}><p>{filterJson.filterName}</p><select  onChange={event => onChange(event)}>{options}</select></div>);
    }

}
