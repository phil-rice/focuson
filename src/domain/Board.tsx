import React from 'react';
import {RestChild, RestProperties} from "../reactrest/ReactRestElements";
import {BoardData, Domain, GameData, NoughtOrCross, WithState} from "./Domain";
import {Lens} from "../reactrest/utils";

type R<T> = RestProperties<React.ReactElement, Domain, GameData, T>

interface BoardProperties {
    stateLens: Lens<GameData, NoughtOrCross>
}
function Board(rest: R<BoardData>): (props: BoardProperties) => React.ReactElement {
    console.log("Board")
    let domain = rest.restRoot.domain
    return props => {
        console.log("Board", rest, props)
        let sq = (n: number) => (<RestChild render='square' rest={rest} lens={domain.boardToNthL(n)}/>)
        return (
            <div>
                <div className="board-row">{sq(0)} {sq(1)} {sq(2)}</div>
                <div className="board-row">{sq(3)} {sq(4)} {sq(5)}</div>
                <div className="board-row">{sq(6)} {sq(7)} {sq(8)}</div>
            </div>)
    }
}
