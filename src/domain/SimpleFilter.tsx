import React from "react";
import {CPQFilter, CPQRest} from "./CpqDomain";


function SimpleFilter<Parent>(rest: CPQRest<Parent, CPQFilter>): (props: any) => React.ReactElement {
    const onChange = (event: any) => { console.log("onChange.target", event.target.value)};
    let options=rest.json().legalValues.map(v => (<option key={v}>{v}</option>))
    return props => (<select onChange={event => onChange(event)}>{options}</select>)

}
