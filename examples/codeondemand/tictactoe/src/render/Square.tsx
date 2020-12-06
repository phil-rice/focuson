import {GameProps, NoughtOrCross} from "../GameDomain";

/** IF you are wondering why we have SimpleGame.square, and square and square2, it is so that we can demonstrate loading difference versions of essentially the same thing */
export function Square<Main>({context}: GameProps< Main, NoughtOrCross>) {
    // console.log('square', props)
    let onClick = () => context.dangerouslySetMain(context.domain.setSquareAndToggleState(context))
    return (<button className='square' onClick={onClick}>{context.json()}</button>)
}

