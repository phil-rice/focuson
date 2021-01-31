//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {focusOnNth, Lens, LensContext, LensProps} from "@phil-rice/lens";
import * as React from "react";


//These are the interfaces to describe the Game json
export interface GameData {
    next: NoughtOrCross,
    board: BoardData
}
type NoughtOrCross = "O" | "X" | ""
export interface BoardData {squares: SquareData}
type SquareData = NoughtOrCross[]
export let nextStateLens = Lens.build<GameData>('game').field('next')

/** This is a helper to get rid of the noise of  LensProps<GameDomain, GameData, T> replacing it with GameProps<T> */
export type GameProps<Main,T> = LensProps<GameDomain, Main, T>

export class GameDomain {
    nextStateLens: Lens<GameData, NoughtOrCross>
    constructor(nextStateLens: Lens<GameData, NoughtOrCross>) { this.nextStateLens = nextStateLens; }
    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')};
    setSquareAndInvertNext<Main>(context: LensContext<GameDomain, GameData, NoughtOrCross>) {
        let next = context.jsonFromLens(this.nextStateLens)
        if (context.json() === '')
            context.setFromTwo(this.nextStateLens, next, this.invert(next))
    }

}
//This is the json representation of the state of the game
export let emptyGame: GameData = {
    "next": "X",
    "board": {
        "squares": ["", "", "", "", "", "", "", "", ""]
    }
}

export function SimpleGame({context}: GameProps<GameData,GameData>) {
    return (
        <div className='game'>
            <NextMove context={context.focusOn('next')}/>
            <Board context={context.focusOn('board')}/>
        </div>)
}


export function NextMove({context}: GameProps<GameData,NoughtOrCross>) {
    return (<div> Next Move{context.json()}</div>)
}


export function Board({context}: GameProps<GameData,BoardData>) {
    let squares = context.focusOn('squares');
    let sq = (n: number) => (<Square context={focusOnNth(squares, n)}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

export function Square({context}: GameProps<GameData,NoughtOrCross>) {
    return (
        <button className='square' onClick={() => context.domain.setSquareAndInvertNext(context)}>
            {context.json()}
        </button>)
}