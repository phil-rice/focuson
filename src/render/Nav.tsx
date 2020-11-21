import React from "react";
import {NavData, NavProperties} from "../domain/NavDomain";
import {Lens} from "../optics/optics";
import {ComponentFromServer} from "../componentFromServer/ComponentFromServer";


function Nav<DomainMap, Main>(props: NavProperties<DomainMap, Main, NavData>) {
    let groups = props.context.json().groups.map((g, i) =>
        (<ComponentFromServer key={i} context={props.context.focusOn('groups').withLens(Lens.nth(i))}/>))
    return (<ul key={'groups'}>{groups}</ul>)
}
