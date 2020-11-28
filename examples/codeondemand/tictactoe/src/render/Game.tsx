import {GameData, GameProps, Link} from "../GameDomain";
import {ComponentFromServer} from "@phil-rice/codeondemand";



function Game<Main>({context}: GameProps<GameData, GameData>) {
    return (<div className='game'>
        <div className={'game-info'}>
            <p>Next turn is {context.json().state}</p>
            <ul>
                <LoadGame context={context.focusOn('_links').focusOn('game1')}/>
                <LoadGame context={context.focusOn('_links').focusOn('game2')}/>
            </ul>
        </div>
        <div className='game-board'>
            <ComponentFromServer context={context.focusOn('_embedded').focusOn('board')}/>
        </div>
    </div>)
}

function LoadGame<Main>(props: GameProps<Main, Link>) {
    let url = props.context.json().href;
    let onclick = () => props.context.domain.loadJson(url)
    return (<li><a onClick={onclick}>{url}</a></li>)
}
