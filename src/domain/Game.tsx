import React from 'react';
import {Rest, RestProperties} from "../reactrest/ReactRestElements";
import {BoardData, Domain, GameData} from "./Domain";

type R<T> = RestProperties<React.ReactElement, Domain, GameData, T>
function Game(rest: R<GameData>): (props: any) => React.ReactElement {
    return props => {
        let newRest: R<BoardData> = rest.withLens(rest.domain().gameToBoardL);
        return (<div className='game'>
            <div className='game-board'>
                <Rest rest={newRest}/>
            </div>
        </div>)
    }
}


