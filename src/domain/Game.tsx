import React from 'react';
import {Rest, RestProperties} from "../reactrest/ReactRestElements";
import {BoardData, Domain, GameData} from "./Domain";

type R<T> = RestProperties<React.ReactElement, Domain, GameData, T>
function Game(rest: R<GameData>): (props: any) => React.ReactElement {
    return props => {
        let newRest: R<BoardData> = rest.withLens(rest.domain().gameToBoardL);
        function load(name: string) {
            // @ts-ignore
            let url = rest.json()._links[name].href
            console.log(name, url)
            rest.restRoot.reactRest.loadAndRender(url, rest.restRoot.setMainJson)
        }
        return (<div className='game'>
            <div className='game-board'>
                <Rest rest={newRest}/>
            </div>
            <ul>
                <li>
                    <button onClick={() => load('game1')}>Square</button>
                </li>
                <li>
                    <button onClick={() => load('game2')}>Square</button>
                </li>
            </ul>
        </div>)
    }
}


