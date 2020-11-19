import React from "react";
import {GameRest} from "./Domain";
import {CPQFilter, CPQRest} from "./CpqDomain";


function SimpleFilter<Parent>(rest: CPQRest<Parent, CPQFilter>): (props: any) => React.ReactElement {
    return props => {
        console.log("Got to simple filter", rest)
        console.log("Got to simple filter with json", rest.json())
        let json: CPQFilter = rest.json()
        let values = json.legalValues
        return (<select >{lega}</select>)
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
