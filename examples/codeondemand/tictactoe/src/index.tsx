//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import ReactDOM from 'react-dom';
import './index.css';
import {SHA256} from 'crypto-js'
import {GameContext, GameData, GameDomain, NoughtOrCross} from "./GameDomain";
import {getElement, LensContext, Lenses} from "../../../../modules/lens"; //changed from @phil-rice/lens;
import {ComponentFromServer, LoadAndCompileCache, loadJsonFromUrl, MakeComponentFromServer} from "../../../../modules/codeondemand"; //changed from @phil-rice/codeondemand;
import React from "react";

let cache = LoadAndCompileCache.create<MakeComponentFromServer<React.ReactElement>>((s: string) => SHA256(s).toString())


function invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}
export let nextStateLens = Lenses.build<GameData>('game').focusOn('state')
const nextValueForSquare = (sq: NoughtOrCross, next: NoughtOrCross) => next;
const nextValueForNext = (sq: NoughtOrCross, next: NoughtOrCross) => invert(next);
function onClickSquare(squareContext: LensContext<GameData, NoughtOrCross>): void {
    if (squareContext.json() == '')
        squareContext.useOtherLensAsWell(nextStateLens).transformTwoValues(nextValueForSquare, nextValueForNext)
}

let element = getElement('root')

function loadJson(url: string) {
    const domain: GameDomain = {loadJson, onClickSquare}
    return loadJsonFromUrl<GameData>('game', cache, (cache, c) =>
        ReactDOM.render(
            <GameContext.Provider value={domain}>
                <ComponentFromServer context={c}/>
            </GameContext.Provider>, element))(url)
}

loadJson('created/gameJson1.json')


