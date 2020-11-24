import {GameData, GameProps} from "../GameDomain";
import {ComponentFromServer} from "@phil-rice/codeondemand";


function Game<Main>(props: GameProps<Main, GameData>) {
    return (<div className='game'>
        <div className={'game-info'}>Next turn is {props.context.json().state}</div>
        <div className='game-board'>
            <ComponentFromServer context={props.context.focusOn('_embedded').focusOn('board')}/>
        </div>
    </div>)
}

