//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Lenses} from "@phil-rice/lens";
import {focusOnNth, LensProps} from "@phil-rice/state";
import * as React from "react";


//These are the interfaces to describe the Game json
export interface GameData {
    next: NoughtOrCross,
    board: BoardData
}
type NoughtOrCross = "O" | "X" | ""
export interface BoardData {squares: SquareData}
type SquareData = NoughtOrCross[]


/** This is a helper to get rid of the noise of  LensProps<GameDomain, GameData, T> replacing it with GameProps<T> */
export type GameProps<Main, T> = LensProps<Main, T>

//This is the json representation of the state of the game
export let emptyGame: GameData = {
    "next": "X",
    "board": {
        "squares": ["", "", "", "", "", "", "", "", ""]
    }
}

export function SimpleGame({context}: GameProps<GameData, GameData>) {
    return (
        <div className='game'>
            <NextMove context={context.focusOn('next')}/>
            <Board context={context.focusOn('board')}/>
        </div>)
}


export function NextMove({context}: GameProps<GameData, NoughtOrCross>) {
    return (<div> Next Move{context.json()}</div>)
}


export function Board({context}: GameProps<GameData, BoardData>) {
    let squares = context.focusOn('squares');
    let sq = (n: number) => (<Square context={focusOnNth(squares, n)}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

function invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

export let nextStateLens = Lenses.build<GameData>('game').focusOn('next')
const nextValueForSquare = (sq: NoughtOrCross, next: NoughtOrCross) => next;
const nextValueForNext = (sq: NoughtOrCross, next: NoughtOrCross) => invert(next);

export function Square({context}: GameProps<GameData, NoughtOrCross>) {
    let onClick = () => {
        if (context.json() == '')
            context.useOtherLensAsWell(nextStateLens).transformTwoValues(nextValueForSquare, nextValueForNext)
    }
    return (<button className='square' onClick={onClick}>{context.json()}</button>)
}
