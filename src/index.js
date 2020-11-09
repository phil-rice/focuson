import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ReactRest, ReactRestCache} from "./reactrest/reactRest";

import {SHA256} from 'crypto-js'

import {shas} from './created/shas'

let loader = url => {
    return fetch(url).then(response => {
        return response.text();
    })
}


var cache = new ReactRestCache(loader, SHA256)

console.log("shas1", shas)
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
            return ReactDOM.render(reactComponentClass, element)
        }
    )
}

function startGame() {
    return renderIt(gameJson, document.getElementById('root'))
}

// console.log(findAllRenderUrls(gameJson))
var gamePromise = startGame()

export function changeGameRendering(json) {
    console.log("renderUrls", cache.findAllRenderUrls(json))
    cache.loadFromBlob(json)
    gamePromise.then(game => game.setState(json))
}