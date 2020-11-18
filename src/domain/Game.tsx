import React from 'react';
import {Rest, RestProperties} from "../reactrest/ReactRestElements";
import {BoardData, Domain, GameData, NoughtOrCross, WithState} from "./Domain";

type R<T> = RestProperties<React.ReactElement, Domain, GameData, T>
function Game(rest: R<GameData>): (props: any) => React.ReactElement {
    return props => {
        let domain = rest.restRoot.domain;
        let newRest: R<WithState<NoughtOrCross, BoardData>> = rest.withLens(domain.gameToBoardL);
        return (<div className='game'>
            <div className='game-board'>
                <Rest rest={newRest}/>
            </div>
        </div>)
    }
}


