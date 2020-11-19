import {GameRest, HasStateLens, NoughtOrCross} from "../domain/Domain";
import React from "react";
import {Lens, Tuple} from "../reactrest/utils";


function Square<Parent>(rest: GameRest<Parent, NoughtOrCross>): (props: HasStateLens<Parent>) => React.ReactElement {
    function invertStateAndSet(state: NoughtOrCross, existingCell: NoughtOrCross): Tuple<NoughtOrCross,NoughtOrCross> {return ({one: rest.domain().invert(state), two: state})}
    function onClick(stateLens: Lens<Parent, NoughtOrCross>) {if (rest.json().length === 0) rest.setFrom2Lens(stateLens, rest.lens, invertStateAndSet) }

    return props => (<button className='square' onClick={() => onClick(props.stateLens)}>{rest.json()}</button>)
}
