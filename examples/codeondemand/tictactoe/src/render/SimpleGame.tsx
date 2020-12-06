import {BoardData, GameData, GameProps, NoughtOrCross} from "../GameDomain";
import {Lens} from "@phil-rice/lens";


function SimpleGame<Main>({context}: GameProps<Main, GameData>) {
    return (<div className='game'>
        <Board context={context.focusOn("_embedded").focusOn('board')}/>
    </div>)
}

function Board<Main>({context}: GameProps<Main, BoardData>) {
    let squares = context.focusOn('squares');
    let sq = (n: number) => (<Square context={squares.withChildLens(Lens.nth(n))}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

/** IF you are wondering why we have SimpleGame.square, and square and square2, it is so that we can demonstrate loading difference versions of essentially the same thing */
function Square<Main>({context}: GameProps<Main, NoughtOrCross>) {
    let onClick = () => context.dangerouslySetMain(context.domain.setSquareAndToggleState(context))
    return (<button className='square' onClick={onClick}>{context.json()}</button>)
}