import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {SHA256} from 'crypto-js'
import {MakeRestElement, ReactRest} from "./reactrest/reactRest";
import {LoadAndCompileCache} from "./reactrest/LoadAndCompileCache";
import {RestRoot} from "./reactrest/ReactRestElements";
import {Domain, GameData} from "./domain/Domain";


let loader = (url: string) => fetch(url).then(response => response.text())
// @ts-ignore // the actual signature is a HasherHelper, but we want to say something simpler, and it works
let cache = new LoadAndCompileCache<MakeRestElement<React.Element>>(loader, SHA256)
let domain = new Domain()
let reactRest = new ReactRest(React.createElement, cache);

function setJson(element: HTMLElement) {
    return (main: GameData) => ReactDOM.render(<RestRoot reactRest={reactRest} mainJson={main} domain={domain} setMainJson={setJson(element)}/>, element)
}

let root = document.getElementById('root');
if (root === null) throw Error(`Must have an element called root, and can't find it`)

reactRest.loadAndRender("created/gameJson1.json", setJson(root))
