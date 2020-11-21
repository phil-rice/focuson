import {GameProperties, NoughtOrCross} from "../domain/GameDomain";
import React from "react";

function Square<Main>(props: GameProperties<Main, NoughtOrCross>) {
    let onClick = () => props.context.setJson(props.context.domain.getAndToggleNextState())
    return (<button className='square' onClick={onClick}>{props.context.json() + "."}</button>)
}



