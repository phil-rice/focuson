import React from 'react';
import {GameData, GameProperties} from "../domain/GameDomain";
import {ComponentFromServer} from "../componentFromServer/ComponentFromServer";

function Game<Main>(props: GameProperties<Main, GameData>) {
    return (<div className='game'>
        <div className={'game-info'}>Next turn is {props.context.json().state}</div>
        <div className='game-board'>
            <ComponentFromServer context={props.context.focusOn('_embedded').focusOn('board')}/>
        </div>
    </div>)
}

