import {GameProps, NoughtOrCross} from "../GameDomain";

/** IF you are wondering why we have SimpleGame.square, and square and square2, it is so that we can demonstrate loading difference versions of essentially the same thing */
function Square<Main>({context}: GameProps<Main, NoughtOrCross>) {
    let onClick = () => context.setJson(context.domain.getAndToggleNextState())
    return (<button className='square' onClick={onClick}>{context.json() + "."}</button>)
}



