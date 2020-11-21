import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BoardData, defaultStateLens, GameData, NoughtOrCross} from "./domain/GameDomain";
import {getElement} from "./utils";
import {LensContext, LensProps} from "./optics/LensContext";
import {Lens} from "./optics/optics";

type GameProps<Main, T> = LensProps<Domain, React.ReactElement, Main, T>

class Domain {
    stateLens: Lens<GameData, NoughtOrCross>

    constructor(stateLens: Lens<GameData, NoughtOrCross>) { this.stateLens = stateLens;}

    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

    setSquareAndToggleState = (context: LensContext<Domain, React.ReactElement, GameData, NoughtOrCross>) =>
        Lens.transform2(context.lens, this.stateLens)((sq, state) =>
            sq === '' ? {one: state, two: this.invert(state)} : {one: sq, two: state})(context.main)
}

function SimpleGame(props: GameProps<GameData, GameData>) {
    console.log("in simple game", props)
    return (<div className='game'>
        <Board context={props.context.focusOn("_embedded").focusOn('board')}/>
    </div>)
}

function Board(props: GameProps<GameData, BoardData>) {
    let squares = props.context.focusOn('squares');
    let sq = (n: number) => (<Square context={squares.withLens(Lens.nth(n))}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

function Square(props: GameProps<GameData, NoughtOrCross>) {
    let onClick = () => props.context.dangerouslySetMain(props.context.domain.setSquareAndToggleState(props.context))
    return (<button className='square' onClick={onClick}>{props.context.json()}</button>)
}

let element = getElement("root")
let gameDomain: Domain = new Domain(defaultStateLens)
LensContext.setJson<Domain, React.ReactElement, GameData>(gameDomain, element, c => (ReactDOM.render(<SimpleGame context={c}/>, element)))


