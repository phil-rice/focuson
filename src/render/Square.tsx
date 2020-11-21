import {GameProperties, NoughtOrCross} from "../domain/GameDomain";
import React from "react";


function Square<Main>(props: GameProperties< Main, NoughtOrCross>) {
    console.log('square', props)
    let onClick = () => props.context.dangerouslySetMain(props.context.domain.setSquareAndToggleState(props.context))
    return (<button className='square' onClick={onClick}>{props.context.json()}</button>)
}

