import React from "react";

import {Rest} from "../reactrest/ReactRestElements";
import {CqpData, CqpRest} from "../domain/CpqDomain";
import {Lens} from "../utils";


function Cpq<Parent>(rest: CqpRest<Parent, CqpData>): (props: any) => React.ReactElement {
    const filters = (json: CqpData) => json.filters.map((f, i) =>
        (<Rest rest={rest.then('filters').withLens(Lens.nth(i))}/>))

    return props => (<div className='cpq'>{filters(rest.json())}</div>)
}
