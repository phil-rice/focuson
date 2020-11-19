import React from 'react';
import {Rest, RestProperties} from "../reactrest/ReactRestElements";
import {Domain, GameData} from "./Domain";

type R<T> = RestProperties<React.ReactElement, Domain, GameData, T>
function Game(rest: R<GameData>): (props: any) => React.ReactElement {
    return props => {
        let load = (name: 'game1' | 'game2') =>
            rest.restRoot.reactRest.loadAndRender(rest.json()._links[name].href, rest.restRoot.setMainJson)
        return (<div className='game'>
            <div className='game-board'>
                <Rest rest={rest.withLens(rest.domain().gameToBoardL)}/>
            </div>
            <div>
                <button onClick={() => load('game1')}>Square</button>
                <button onClick={() => load('game2')}>Square with dots</button>
            </div>
        </div>)
    }
}




