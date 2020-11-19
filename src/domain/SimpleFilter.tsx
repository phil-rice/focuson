import React from "react";
import {CPQFilter, CPQRest} from "./CpqDomain";


function SimpleFilter<Parent>(rest: CPQRest<Parent, CPQFilter>): (props: any) => React.ReactElement {
    const onChange = (event: any) => { console.log("onChange.target", rest.setJson(event.target.value)};
    return props => {
        return (<select onChange={event => onChange(event)}>{rest.json().legalValues.map(v => (<option key={v}>{v}</option>))}</select>)
    }

    let sample = {
        "modelFilter": {
            "_render": {"_self": "created/simpleFilter/38c30fc0ee73233e796b0063bcd0d5124c851e9f30d2c84640120d5bedb08db2"},
            "filterName": "filterlist.model",
            "selected": null,
            "legalValues": ["Audi A10", "BMW series 6", "Tesla Roadster"]
        }
    }
}
