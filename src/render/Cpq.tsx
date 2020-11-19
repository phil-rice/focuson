import React from "react";

import {Rest} from "../reactrest/ReactRestElements";
import {CPQ, CPQRest} from "../domain/CpqDomain";


function Cpq<Parent>(rest: CPQRest<Parent, CPQ>): (props: any) => React.ReactElement {
    return props => (
        <ul>
            <li><Rest rest={rest.then('makeFilter')}/></li>
            <li><Rest rest={rest.then('modelFilter')}/></li>
        </ul>)
}
