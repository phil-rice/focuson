import {GameData, GameRest, NoughtOrCross} from "../domain/GameDomain";
import React from "react";

function Square<Main, Parent>(rest: GameRest<Main, Parent, NoughtOrCross>): (props: any) => React.ReactElement {
    let onClick = () => rest.setJson(rest.domain().getAndToggleNextState())
    return props => (<button className='square' onClick={onClick}>{rest.json() + "."}</button>)
}
