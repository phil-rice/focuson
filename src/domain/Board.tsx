import React from 'react';
import {RestChild, RestProperties} from "../reactrest/ReactRestElements";
import {BoardData, Domain, GameData} from "./Domain";

type R<T> = RestProperties<React.ReactElement, Domain, GameData, T>

function Board(rest: R<BoardData>): (props: any) => React.ReactElement {
    return props => {
        let sq = (n: number) => (<RestChild render='square'rest = {rest} lens={rest.domain.boardToNthL(n)} />)
        return (
            <div>
                <div className="board-row">{sq(0)} {sq(1)} {sq(2)}</div>
                <div className="board-row">{sq(3)} {sq(4)} {sq(5)}</div>
                <div className="board-row">{sq(6)} {sq(7)} {sq(8)}</div>
            </div>)
    }
}
