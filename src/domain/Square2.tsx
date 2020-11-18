import {RestProperties} from "../reactrest/ReactRestElements";
import {BoardData, Domain, GameData} from "./Domain";
import React from "react";


function Square(rest: RestProperties<React.ReactElement, Domain, GameData, number>): (props: any) => React.ReactElement {
    return props => {
        console.log("Square", rest, props)
        return React.createElement('button', {...props, className: 'square'}, rest.json() + ".")
    }
}
