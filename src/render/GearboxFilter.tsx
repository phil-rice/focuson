import React from "react";
import {CqpFilter, CqpRest} from "../domain/CpqDomain";


function GearboxFilter<Parent>(rest: CqpRest<Parent, CqpFilter>): (props: any) => React.ReactElement {
    const onChange = (event: any) => { console.log("onChange.target", event.target.value)};
    let filterJson = rest.json();
    return props => {
        let options = rest.domain().makeSelected(filterJson.selected, rest.json().legalValues);
        return (<div>
            Gearbox Filter
            <select key={filterJson.filterName} onChange={event => onChange(event)}>{options}</select>
        </div>);
    }

}
let e =  {
    "_render"    : {"_self": "#GearboxFilter/render#"},
    "filterName" : "filter.transmission",
    "selected"   : null,
    "legalValues": ["Automatic", "Gearbox"]
}