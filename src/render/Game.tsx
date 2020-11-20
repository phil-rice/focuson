import React from 'react';
import {Rest} from "../reactrest/ReactRestElements";
import {GameData, GameRest} from "../domain/Domain";


function Game<Parent>(rest: GameRest<Parent, GameData>): (props: any) => React.ReactElement {
    return props => {
        return (<div className='game'>
            <div className={'game-info'}>Next turn is {rest.json().state}</div>
            <div className='game-board'>
                <Rest stateLens= {rest.fieldLens('state')} rest={rest.then('_embedded').then('board')}/>
            </div>
        </div>)
    }
}
