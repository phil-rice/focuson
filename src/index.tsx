import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {SHA256} from 'crypto-js'
import {MakeRestElement, ReactRest} from "./reactrest/reactRest";
import {LoadAndCompileCache} from "./reactrest/LoadAndCompileCache";
import {Rest,RestChild, RestProperties, RestRootProperties} from "./reactrest/ReactRestElements";
import {Domain, GameData} from "./domain/Domain";


let loader = (url: string) => fetch(url).then(response => response.text())
// @ts-ignore // the actual signature is a HasherHelper, but we want to say something simpler, and it works
let cache = new LoadAndCompileCache<MakeRestElement<React.Element>>(loader, SHA256)


let gameJson1 = fetch("created/gameJson1.json").then(r => r.json())
let gameJson2 = fetch("created/gameJson2.json").then(r => r.json())

//steps:
// call the api and get the result in a promise... that sounds easy enough
// set state on the component you are in which forces a redraw

function renderIt(json: any, element: HTMLElement): Promise<void> {
    let reactRest = new ReactRest(React.createElement, cache);
    let rootProperties: RestRootProperties<React.ReactElement, Domain, GameData> = {reactRest: reactRest, mainJson: json, domain: new Domain()}
    let rest = RestProperties.create(rootProperties)
    return cache.loadFromBlob(json).then(theyAreLoaded => ReactDOM.render(<Rest rest={rest} />, element))
}


function startGame() {
    let root = document.getElementById('root');
    if (root === null) throw Error(`Must have an element called root, and can't find it`)
    let x: HTMLElement = root
    return gameJson1.then(j => {
        renderIt(j, x);
        return j
    })
}

var gamePromise: Promise<any> = startGame()

export function changeGameRendering(json: any) {
    cache.loadFromBlob(json)
    // gamePromise.then(game => game.setState(json))
}