import {GameProps, NoughtOrCross} from "../GameDomain";


export function Square<Main>(props: GameProps< Main, NoughtOrCross>) {
    // console.log('square', props)
    let onClick = () => props.context.dangerouslySetMain(props.context.domain.setSquareAndToggleState(props.context))
    return (<button className='square' onClick={onClick}>{props.context.json()}</button>)
}

