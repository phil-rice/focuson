import ReactDOM from 'react-dom';
import './index.css';
import {SHA256} from 'crypto-js'
import {defaultStateLens, GameData, GameDomain} from "./GameDomain";
import {getElement} from "@phil-rice/lens";
import {ComponentFromServer, LoadAndCompileCache, loadAndRenderIntoElement, MakeComponentFromServer} from "@phil-rice/codeondemand";
import React from "react";

let cache = LoadAndCompileCache.create<MakeComponentFromServer<React.ReactElement>>((s: string) => SHA256(s).toString())


function setJson(url: string) {
    let element = getElement('root')
    let gameDomain: GameDomain<GameData> = new GameDomain(cache, defaultStateLens, setJson)
    return loadAndRenderIntoElement<React.ReactElement, GameDomain<GameData>, GameData>(gameDomain, 'game',
        c => ReactDOM.render(<ComponentFromServer context={c}/>, element))(url)
}

setJson('created/gameJson1.json')


