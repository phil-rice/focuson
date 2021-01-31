//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {GameData, GameProps, Link} from "../GameDomain";
import {ComponentFromServer} from "@phil-rice/codeondemand";



export function Game<Main>({context}: GameProps<GameData, GameData>) {
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

export function LoadGame<Main>(props: GameProps<Main, Link>) {
    let url = props.context.json().href;
    let onclick = () => props.context.domain.loadJson(url)
    return (<li><a onClick={onclick}>{url}</a></li>)
}
