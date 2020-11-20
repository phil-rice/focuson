import React from 'react';
import {RestChild} from "../reactrest/ReactRestElements";


import {BoardData, GameRest, HasStateLens} from "../domain/GameDomain";
import {Lens} from "../optics/optics";


function Board<Main, Parent>(rest: GameRest<Main, Parent, BoardData>): (props: HasStateLens<Parent>) => React.ReactElement {
    return props => {
        let sq = (n: number) =>
            (<RestChild stateLens={props.stateLens} render='square' parentRest={rest} lens={rest.fieldLens('squares').andThen(Lens.nth(n))}/>)
        return (
            <div>
                <div className="board-row">{sq(0)} {sq(1)} {sq(2)}</div>
                <div className="board-row">{sq(3)} {sq(4)} {sq(5)}</div>
                <div className="board-row">{sq(6)} {sq(7)} {sq(8)}</div>
            </div>)
    }
}
