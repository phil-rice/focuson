//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
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


