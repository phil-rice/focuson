import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ReactRest, ReactRestCache, RestRoot} from "./reactrest/reactRest";

import {SHA256} from 'crypto-js'

import {shas} from './created/shas'

let loader = url => fetch(url).then(response => response.text())

var cache = new ReactRestCache(loader, SHA256)

console.log("shas1", shas)
let gameJson1 = fetch("created/gameJson1.json").then(r => r.json())
let gameJson2 = fetch("created/gameJson2.json").then(r => r.json())


function renderIt(json, element) {
    return cache.loadFromBlob(json).then(theyAreLoaded => {
            let reactRest = new ReactRest(React.createElement, cache);
            let e = (<RestRoot reactRest={reactRest} json={json} />)
            return ReactDOM.render(e, element)
        }
    )
}

//  return cache.loadFromBlob(json).then(theyAreLoaded => {
//             let e = (<Rest reactRest={reactRest} reactCache={cache}>
//
//             </Rest>)
//             return ReactDOM.render(e, element)
//         }
//     )

function startGame() {
    return gameJson1.then(j => renderIt(j, document.getElementById('root')))
}

// console.log(findAllRenderUrls(gameJson1))
var gamePromise = startGame()

export function changeGameRendering(json) {
    console.log("renderUrls", cache.findAllRenderUrls(json))
    cache.loadFromBlob(json)
    gamePromise.then(game => game.setState(json))
}