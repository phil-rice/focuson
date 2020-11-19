import {GameData, GameRest, NoughtOrCross} from "../domain/Domain";
import React from "react";

function Square(rest: GameRest<GameData, NoughtOrCross>): (props: any) => React.ReactElement {
    let onClick = () => rest.setJson(rest.domain().getAndToggleNextState())
    return props => (<button className='square' onClick={onClick}>{rest.json() + "."}</button>)
}
