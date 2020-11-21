import React from 'react';
import {BoardData, GameDomain, GameProperties, NoughtOrCross} from "../domain/GameDomain";
import {Lens} from "../optics/optics";
import {ChildFromServer, ComponentFromServer} from "../reactrest/ComponentFromServer";

function Board<Main>(props: GameProperties<Main, BoardData>) {
    let sq = (n: number) =>
        (<ChildFromServer render='square' context={props.context} childContext={props.context.focusOn('squares').withLens(Lens.nth(n))}/>)
    return (
        <div>
            <div className="board-row">{sq(0)} {sq(1)} {sq(2)}</div>
            <div className="board-row">{sq(3)} {sq(4)} {sq(5)}</div>
            <div className="board-row">{sq(6)} {sq(7)} {sq(8)}</div>
        </div>)
}
