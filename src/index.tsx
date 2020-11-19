import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {SHA256} from 'crypto-js'
import {MakeRestElement, ReactRest} from "./reactrest/reactRest";
import {digestorChecker, LoadAndCompileCache} from "./reactrest/LoadAndCompileCache";
import {RestRoot} from "./reactrest/ReactRestElements";
import {Domain} from "./domain/Domain";


let loader = (url: string) => fetch(url).then(response => response.text())
// @ts-ignore // the actual signature is a HasherHelper, but we want to say something simpler, and it works
let cache = new LoadAndCompileCache<MakeRestElement<React.Element>>(loader, digestorChecker(SHA256))
let domain = new Domain()
let reactRest = new ReactRest(React.createElement, cache);

const setJson = (element: HTMLElement) => <Main extends any>(main: Main) =>
    ReactDOM.render(<RestRoot reactRest={reactRest} mainJson={main} domain={domain} setMainJson={setJson(element)}/>, element);

// function setCpqJson(element: HTMLElement) {
//     return (main: CPQ) => {
//         console.log("setCpqJson", main)
//         return ReactDOM.render(
//             <RestRoot reactRest={reactRest} mainJson={main} domain={domain} setMainJson={setCpqJson(element)}/>, element)
//     }
// }

let game = document.getElementById('game');
if (game === null) throw Error(`Must have an element called root, and can't find it`)

let cpq = document.getElementById('cpq');
if (cpq === null) throw Error(`Must have an element called cpq, and can't find it`)

reactRest.loadAndRender("created/gameJson1.json", setJson(game))
reactRest.loadAndRender("created/cpqJson1.json", setJson(cpq))
