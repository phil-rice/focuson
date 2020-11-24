import {GameProps, NoughtOrCross} from "../GameDomain";

function Square<Main>(props: GameProps<Main, NoughtOrCross>) {
    let onClick = () => props.context.setJson(props.context.domain.getAndToggleNextState())
    return (<button className='square' onClick={onClick}>{props.context.json() + "."}</button>)
}



