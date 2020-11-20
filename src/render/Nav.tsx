import React from "react";

import {Rest} from "../reactrest/ReactRestElements";
import {NavData, NavProperties, NavRest} from "../domain/NavDomain";
import {Lens} from "../utils";


function Nav<Parent>(rest: NavRest<Parent, NavData>): (props: NavProperties) => React.ReactElement {
    return props => {
        console.log("Nav.loadUrlAndPutInElement",props.loadUrlAndPutInElement)
        let groups = rest.json().groups.map((g, i) => (<Rest key={i} loadUrlAndPutInElement={props.loadUrlAndPutInElement} rest={rest.then('groups').withLens(Lens.nth(i))}/>))
        return (<ul key={'groups'}>{groups}</ul>)
    }
}
