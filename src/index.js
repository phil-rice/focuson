import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ReactRest, ReactRestCache, RestRoot} from "./reactrest/reactRest";

import {SHA256} from 'crypto-js'

import {shas} from './created/shas'

let loader = url => fetch(url).then(response => response.text())

var cache = new ReactRestCache(loader, SHA256)

console.log("shas1", shas)

let actions = {
    loadJson: "LoadJson"
}

let dispatcher = dispatch => {
    return {
        loadJson: (url) => dispatch({type: actions.loadJson, json: url})
    }
}

let fetchJson = dispatch => {
    dispatch()
}


function reducer(state, action) {
    switch (action.type) {
        case actions.loadJson:
            return {...state, json: action.json}
        default:
            return state;
    }
}


let gameJson1 = fetch("created/gameJson1.json").then(r => r.json())
let gameJson2 = fetch("created/gameJson2.json").then(r => r.json())

//steps:
// call the api and get the result in a promise... that sounds easy enough
// set state on the component you are in which forces a redraw


function renderIt(json, element) {
    let reactRest = new ReactRest(React.createElement, cache);
    return cache.loadFromBlob(json).then(theyAreLoaded => {
            return ReactDOM.render(<RestRoot reactRest={reactRest} json={json}/>, element)
        }
    )
}


function startGame() {
    return gameJson1.then(j => renderIt(j, document.getElementById('root')))
}

var gamePromise = startGame()

export function changeGameRendering(json) {
    console.log("renderUrls", cache.findAllRenderUrls(json))
    cache.loadFromBlob(json)
    gamePromise.then(game => game.setState(json))
}