import {GameRest, HasStateLens, NoughtOrCross} from "./Domain";
import React from "react";
import {Lens, Tuple} from "../reactrest/utils";


function Square<Parent>(rest: GameRest<Parent, NoughtOrCross>): (props: HasStateLens<Parent>) => React.ReactElement {
    return props => {
        const updateCellAndState = () => rest.setFrom2Lens(props.stateLens, rest.lens, (state, cell) => ({one: rest.domain().invert(state), two: state}))
        function onClick() {if (rest.json().length === 0) updateCellAndState() }
        return (<button className='square' onClick={onClick}>{rest.json()}</button>)
    }
}
