import React from 'react';
import ReactDOM from 'react-dom';
import {LensReact} from "./LensReact/LensReact";
import {getElement, Tuple} from '@phil-rice/lens/src/utils';
import {LensProps} from "@phil-rice/lens/src/optics/LensContext";
import {Lens} from "@phil-rice/lens/src/optics/optics";

export type GameProps<T> = LensProps<GameDomain, GameData, T>
export type NoughtOrCross = "O" | "X" | ""

export interface GameData {
    state: NoughtOrCross
    _embedded: { board: BoardData }
}
export interface BoardData {
    squares: SquareData
}
export type SquareData = NoughtOrCross[]

export class GameDomain {
    stateLens: Lens<GameData, NoughtOrCross> = Lens.build<GameData>().then('state');
    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')};
    setSquareAndToggleState(square: NoughtOrCross, state: NoughtOrCross): Tuple<NoughtOrCross, NoughtOrCross> {
        return (square === '') ? ({one: state, two: this.invert(state)}) : ({one: square, two: state})
    }
}
function SimpleGame(props: GameProps<GameData>) {
    console.log("in simple game", props)
    return (<div className='game'>
        <Board context={props.context.focusOn("_embedded").focusOn('board')}/>
    </div>)
}

function Board(props: GameProps<BoardData>) {
    let squares = props.context.focusOn('squares');
    let sq = (n: number) => (<Square context={squares.withLens(Lens.nth(n))}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

function Square(props: GameProps<NoughtOrCross>) {
    let domain = props.context.domain;
    let onClick = () => props.context.setFromTwo(domain.stateLens)(domain.setSquareAndToggleState)
    return (<button className='square' onClick={onClick}>{props.context.json()}</button>)
}

export let setJson: (m: GameData) => void =
    LensReact.setJson<GameDomain, GameData>(new GameDomain(), getElement("root"),
        c => (ReactDOM.render(<SimpleGame context={c}/>, getElement("root"))))

// setJson({
//         "state": "X",
//         "_embedded": {
//             "board": {
//                 "squares": ["", "", "", "", "", "", "", "", ""]
//             }
//         }
//     }
// )

