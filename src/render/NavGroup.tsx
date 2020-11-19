import React from "react";

import {Rest} from "../reactrest/ReactRestElements";
import {CPQ, CPQRest} from "../domain/CpqDomain";
import {NavData, NavGroupData, NavRest} from "../domain/NavDomain";
import {Lens} from "../reactrest/utils";


function NavGroup<Parent>(rest: NavRest<Parent, NavGroupData>): (props: any) => React.ReactElement {
    return props => {
        let name = rest.json().name
        let group = rest.json().jsonFiles.map((j, i) => (<li key={i}><a>{j}</a></li>))
        return (<ul>
            <li key={-1}>{rest.json().name}</li>
            {group}
        </ul>)
    }
}
