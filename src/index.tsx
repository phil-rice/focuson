import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {SHA256} from 'crypto-js'
import {MakeRestElement, ReactRest} from "./reactrest/reactRest";
import {digestorChecker, LoadAndCompileCache} from "./reactrest/LoadAndCompileCache";
import {RestRoot} from "./reactrest/ReactRestElements";
import {GameDomain} from "./domain/GameDomain";
import {CpqDomain} from "./domain/CpqDomain";
import {NavDomain} from "./domain/NavDomain";
import {fromObject, getElement} from "./utils";


let loader = (url: string) => fetch(url).then(response => response.text())
// @ts-ignore // the actual signature is a HasherHelper, but we want to say something simpler, and it works
let cache = new LoadAndCompileCache<MakeRestElement<React.Element>>(loader, digestorChecker(SHA256))
let reactRest = new ReactRest(React.createElement, cache);


const setJson = <Domain extends any>(domain: Domain, element: HTMLElement) => <Main extends any>(main: Main) => {
    ReactDOM.render(<RestRoot<React.ReactElement, Domain, Main>
        reactRest={reactRest}
        mainJson={main}
        domain={domain}
        setMainJson={setJson(domain, element)}
        loadUrlAndPutInElement={loadUrlAndPutInElement}/>, element);
}

interface DomainMap {
    game: GameDomain,
    nav: NavDomain<DomainMap>,
    cpq: CpqDomain
}
let domainMap: DomainMap = {game: new GameDomain(), nav: new NavDomain(loadUrlAndPutInElement, 'target'), cpq: new CpqDomain()}



function loadUrlAndPutInElement(domainName: keyof DomainMap, url: string, name: string) {
    reactRest.loadAndRender(url, setJson(fromObject(domainMap, domainName), getElement(name)))
}
loadUrlAndPutInElement('nav', "created/index.json", 'nav')
loadUrlAndPutInElement('cpq', "created/cpqJson1.json", 'root')
