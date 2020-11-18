import {RestProperties} from "../reactrest/ReactRestElements";
import {Domain, GameData, NoughtOrCross} from "./Domain";
import React from "react";


function Square(rest: RestProperties<React.ReactElement, Domain, GameData, NoughtOrCross>): (props: any) => React.ReactElement {
    let onClick = () => rest.setJson(rest.restRoot.domain.getAndToggleNextState())
    return props => {
        console.log("Square", rest, props)
        return (<button className='square' onClick={onClick}>{rest.json()}</button>)
    }
}
