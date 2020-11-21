import React from "react";
import {CpqData, CpqProperties} from "../domain/CpqDomain";
import {Lens} from "../optics/optics";
import {ComponentFromServer} from "../reactrest/ComponentFromServer";


function Cpq<Main>(props: CpqProperties<Main, CpqData>) {
    const filters = props.context.json().filters.map((f, i) =>
        (<ComponentFromServer context={props.context.focusOn('filters').withLens(Lens.nth(i))}/>))

    return (<div className='cpq'>{filters}</div>)
}
