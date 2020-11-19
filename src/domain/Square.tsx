import {GameRest, HasStateLens, NoughtOrCross} from "./Domain";
import React from "react";
import {Lens} from "../reactrest/utils";


function Square<Parent>(rest: GameRest<Parent, NoughtOrCross>): (props: HasStateLens<Parent>) => React.ReactElement {
    return props => {
        let tupleL = Lens.setTuple(rest.lens, props.stateLens)
        function onClick (){return rest.restRoot.setMainJson(tupleL.transform(t => ({one: t.two, two: rest.domain().invert(t.two)}))}
        return (<button className='square' onClick={onClick}>{rest.json()}</button>)
    }
}
