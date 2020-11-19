import React from 'react';
import {Rest} from "../reactrest/ReactRestElements";
import {GameData, GameRest} from "./Domain";

function Game<Parent>(rest: GameRest<Parent, GameData>): (props: any) => React.ReactElement {
    return props => {
        return (<div className='game'>
            <div className='game-board'>
                <Rest rest={rest.then('_embedded').then('board')}/>
            </div>
            <div>
                <button onClick={() => rest.loadAndRenderLink('game1')}>Square</button>
                <button onClick={() => rest.loadAndRenderLink('game2')}>Square with dots</button>
            </div>
        </div>)
    }
}




