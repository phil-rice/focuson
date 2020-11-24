import {GameData, GameProps, Link} from "../GameDomain";
import {ComponentFromServer} from "@phil-rice/codeondemand";


function Game<Main>(props: GameProps<Main, GameData>) {
    return (<div className='game'>
        <div className={'game-info'}>
            <p>Next turn is {props.context.json().state}</p>
            <ul>
                <LoadGame context={props.context.focusOn('_links').focusOn('game1')}/>
                <LoadGame context={props.context.focusOn('_links').focusOn('game2')}/>
            </ul>
        </div>
        <div className='game-board'>
            <ComponentFromServer context={props.context.focusOn('_embedded').focusOn('board')}/>
        </div>
    </div>)
}

function LoadGame<Main>(props: GameProps<Main, Link>) {
    let onclick = () => props.context.domain.loadJson(props.context.json().href)
    return (<li><a onClick={onclick}>{props.context.json().href}</a></li>)
}
