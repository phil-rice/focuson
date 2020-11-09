import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ReactRest, ReactRestCache} from "./reactrest/reactRest";

import SHA256 from 'cryptojs'

import {shas} from './created/shas'

let loader = url => fetch(url).then(response => response.text())

console.log(" CryptoJS.SHA256",  SHA256)

var cache = new ReactRestCache(loader, () => "not yet implemented")

console.log("shas1", shas)
console.log("shas1.game", shas.game)
let gameJson = {
    _links: {_self: {href: "someUrl/For/This/Game"}},
    _render: {_self: shas.game},
    gameData: 'Some game data properties could go here',
    _embedded: {
        board: {
            _links: {_self: {href: "someUrl/For/The/Board"}},
            _render: {_self: shas.board, square: shas.square},
            squares: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }
}
let game2Json = {
    _links: {_self: {href: "someUrl/For/This/Game"}},
    _render: {_self: shas.game},
    gameData: 'Some game data properties could go here',
    _embedded: {
        board: {
            _links: {_self: {href: "someUrl/For/The/Board"}},
            _render: {_self: shas.board, square: shas.square2},
            squares: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }
}


function renderIt(json, element) {
    return cache.loadFromBlob(json).then(theyAreLoaded => {
            let reactRest = new ReactRest(React.createElement, cache);
            let reactComponentClass = reactRest.renderSelf(json);
            console.log("renderIt", reactComponentClass, json)
            return ReactDOM.render(reactComponentClass, element)
        }
    )
}

function startGame() {
    console.log("restartGame")
    console.log("shas", shas)
    console.log("json", gameJson)
    var result = renderIt(gameJson, document.getElementById('root'))
    result.then(r => console.log("resultOfRestartGame", r))
    return result
}

// console.log(findAllRenderUrls(gameJson))
var gamePromise = startGame()

export function changeGameRendering(json) {
    console.log("renderUrls", cache.findAllRenderUrls(json))
    cache.loadFromBlob(json)
    gamePromise.then(game => game.setState(json))
}