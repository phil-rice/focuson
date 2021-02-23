//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Lens, Lenses} from "@focuson/lens";
import {ChildFromServer} from "@focuson/codeondemand";
import {BoardData, GameProps} from "../GameDomain";

let boardLens: Lens<BoardData, BoardData> = Lenses.build('board');

export function Board({state}: GameProps< BoardData>) {
    const sq = (n: number) => (<ChildFromServer render='square' state={state} lens={boardLens.focusOn('squares').chainWith(Lenses.nth(n))}/>)
    return (
        <div>
            <div className="board-row">{sq(0)} {sq(1)} {sq(2)}</div>
            <div className="board-row">{sq(3)} {sq(4)} {sq(5)}</div>
            <div className="board-row">{sq(6)} {sq(7)} {sq(8)}</div>
        </div>)
}
