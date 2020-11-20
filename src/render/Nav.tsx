import React from "react";

import {Rest} from "../reactrest/ReactRestElements";
import {NavData, NavProperties, NavRest} from "../domain/NavDomain";
import {Lens} from "../optics/optics";



function Nav<Parent>(rest: NavRest<Parent, NavData>): (props: NavProperties) => React.ReactElement {
    return props => {
        console.log("Nav.loadUrlAndPutInElement",rest.domain().loadUrlAndPutInElement)
        let groups = rest.json().groups.map((g, i) => (<Rest key={i} rest={rest.then('groups').withLens(Lens.nth(i))}/>))
        return (<ul key={'groups'}>{groups}</ul>)
    }
}
