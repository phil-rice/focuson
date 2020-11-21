import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {SHA256} from 'crypto-js'
import {LoadAndCompileCache} from "./componentFromServer/LoadAndCompileCache";
import {defaultStateLens, GameData, GameDomain} from "./domain/GameDomain";
import {getElement} from "./utils";
import {ComponentFromServer, MakeComponentFromServer} from "./componentFromServer/ComponentFromServer";
import {LensContext} from "./optics/LensContext";

// @ts-ignore // the actual signature is a HasherHelper, but we want to say something simpler, and it works
let cache = LoadAndCompileCache.create<MakeComponentFromServer<React.ReactElement>>(SHA256)

let gameDomain = new GameDomain<GameData>(cache, defaultStateLens)
let element = getElement("root")
function loadAndRender(url: string): Promise<void> {
    return LensContext.loadAndRenderIntoElement<GameDomain<GameData>, GameData, React.ReactElement>(gameDomain, element,
        (c, e) =>
            ReactDOM.render(<ComponentFromServer<GameDomain<GameData>, GameData, GameData, React.ReactElement> context={c}/>, e))(url)
}

loadAndRender('created/index.json')
