import React from "react";

import {Rest} from "../reactrest/ReactRestElements";
import {CPQ, CPQRest} from "../domain/CpqDomain";
import {NavData, NavRest} from "../domain/NavDomain";
import {Lens} from "../reactrest/utils";


function Nav<Parent>(rest: NavRest<Parent, NavData>): (props: any) => React.ReactElement {
    let groups= rest.json().groups.map((g, i) => (<li><Rest key={i} rest={rest.then('groups').withLens(Lens.nth(i))}/></li>))
    return props => (<ul>{groups}</ul>)
}
