import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getElement, Lens, LensContext, LensProps,focusOnNth} from "@phil-rice/lens";

export interface GameData {
    next: NoughtOrCross,
    board: BoardData
}
type NoughtOrCross = "O" | "X" | ""
export interface BoardData {squares: SquareData}
type SquareData = NoughtOrCross[]

export let emptyGame: GameData = {
    "next": "X",
    "board": {
        "squares": ["", "", "", "", "", "", "", "", ""]
    }
}

export type GameProps<Main, T> = LensProps<GameDomain, Main, T>

export function SimpleGame<Main>({context}: GameProps<Main, GameData>) {
    return (
        <div className='game'>
            <NextMove context={context.focusOn('next')}/>
            <Board context={context.focusOn('board')}/>
        </div>)
}

export function NextMove<Main>({context}: GameProps<Main, NoughtOrCross>) {
    return (<div> Next Move{context.json()}</div>)
}

export function Board<Main>({context}: GameProps<Main, BoardData>) {
    let squares = context.focusOn('squares');
    let sq = (n: number) => (<Square context={focusOnNth(squares, n)}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

export function Square<Main>({context}: GameProps<Main, NoughtOrCross>) {
    return (<button className='square'>{context.json()}</button>)
}

export class GameDomain {
    nextStateLens = Lens.build<GameData>('game').field('next')
    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')};
    setSquareAndInvertNext<Main>(context: LensContext<GameDomain, GameData, NoughtOrCross>) {
        let next = context.jsonFromLens(this.nextStateLens)
        if (context.json() === '')
            context.setFromTwo(this.nextStateLens, next, this.invert(next))
    }
}
let domain = new GameDomain()
let rootElement = getElement("root")
let setJson = LensContext.setJsonForReact<GameDomain, GameData>(domain, 'game',
    c => (ReactDOM.render(<SimpleGame context={c}/>, rootElement)))
setJson(emptyGame)

