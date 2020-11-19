import {GameRest, NoughtOrCross} from "./Domain";
import React from "react";


function Square<Parent>(rest: GameRest<Parent, NoughtOrCross>): (props: any) => React.ReactElement {
    let onClick = () => {if (rest.json() === "") rest.setJson(rest.domain().getAndToggleNextState())}
    return props => (<button className='square' onClick={onClick}>{rest.json()}</button>)
}
