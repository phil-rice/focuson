//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Lens,  Lenses} from "@focuson/lens";
import { LensState,  LensProps} from "@focuson/state";
import {createContext} from "react";


export type GameProps<T> = LensProps<GameData, T>

export interface Link {
    href: string
}
export type NoughtOrCross = "O" | "X" | ""

export interface GameData {
    state: NoughtOrCross,
    _embedded: { board: BoardData },
    _render: { _self: string },
    _links: { game1: Link, game2: Link }
}

export interface BoardData {
    squares: SquareData,
    _render: { _self: string, square: string }
}
export type SquareData = NoughtOrCross[]

export interface HasStateLens<Main> {
    stateLens: Lens<Main, NoughtOrCross>
}

export let defaultStateLens: Lens<GameData, NoughtOrCross> = Lenses.build<GameData>('game').focusOn('state');

export interface GameDomain {
    onClickSquare: (squareState: LensState<GameData, NoughtOrCross>) => void,
    loadJson: (url: string) => void
}

export const GameContext = createContext<GameDomain>({
    onClickSquare: (squareState: LensState<GameData, NoughtOrCross>) => {throw Error('not defined')},
    loadJson: (url: String) => {throw Error('not defined')}
});




function invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}
export let nextStateLens = Lenses.build<GameData>('game').focusOn('state')
const nextValueForSquare = (sq: NoughtOrCross, next: NoughtOrCross) => next;
const nextValueForNext = (sq: NoughtOrCross, next: NoughtOrCross) => invert(next);
export function onClickSquare(squareContext: LensState<GameData, NoughtOrCross>): void {
    if (squareContext.json() == '')
        squareContext.useOtherLensAsWell<NoughtOrCross>(nextStateLens).transformTwoValues(nextValueForSquare, nextValueForNext)
}
