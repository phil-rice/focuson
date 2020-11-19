import React from "react";
import {CPQ, CPQRest} from "./CpqDomain";
import {Rest} from "../reactrest/ReactRestElements";


function Cpq<Parent>(rest: CPQRest<Parent, CPQ>): (props: any) => React.ReactElement {
    return props => (
        <ul>
            <li><Rest rest={rest.then('makeFilter')}/></li>
            <li><Rest rest={rest.then('modelFilter')}/></li>
        </ul>)
}
