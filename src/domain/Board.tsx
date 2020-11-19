import React from 'react';
import {RestChild} from "../reactrest/ReactRestElements";
import {BoardData, GameRest} from "./Domain";
import {Lens} from "../reactrest/utils";


function Board<Parent>(rest: GameRest<Parent,BoardData>): (props: any) => React.ReactElement {
    let sq = (n: number) => (<RestChild render='square' parentRest={rest} lens={rest.fieldLens('squares').andThen(Lens.nth(n))}/>)
    return props => {
        return (
            <div>
                <div className="board-row">{sq(0)} {sq(1)} {sq(2)}</div>
                <div className="board-row">{sq(3)} {sq(4)} {sq(5)}</div>
                <div className="board-row">{sq(6)} {sq(7)} {sq(8)}</div>
            </div>)
    }
}
