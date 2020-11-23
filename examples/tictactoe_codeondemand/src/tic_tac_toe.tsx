import {GameData, GameProps, NoughtOrCross} from "../../../lensreact/src";
import {Lens} from "../../../lens/src/optics/Lens";
import {BoardData} from "./domain";

export function SimpleGame(props: GameProps<GameData>) {
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

