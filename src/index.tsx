import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {SHA256} from 'crypto-js'
import {digestorChecker, LoadAndCompileCache} from "./reactrest/LoadAndCompileCache";
import {GameData, GameDomain} from "./domain/GameDomain";
import {CpqDomain} from "./domain/CpqDomain";
import {NavDomain} from "./domain/NavDomain";
import {fromObject, getElement} from "./utils";
import {ComponentFromServer, DomainWithCache, MakeComponentFromServer} from "./reactrest/ComponentFromServer";
import {LensContext} from "./optics/LensContext";
import {Lens} from "./optics/optics";
import {SimpleGameDomain} from "./domain/SimpleGameDomain";


let loader = (url: string) => fetch(url).then(response => response.text())
// @ts-ignore // the actual signature is a HasherHelper, but we want to say something simpler, and it works
let cache = new LoadAndCompileCache<MakeComponentFromServer<React.Element>>(loader, digestorChecker(SHA256))
// let reactRest = new ReactRest(React.createElement, cache);


// const setJson = <Domain extends any>(domain: Domain, element: HTMLElement) => <Main extends any>(main: Main) => {
//     ReactDOM.render(<RestRoot<React.ReactElement, Domain, Main>
//         reactRest={reactRest}
//         mainJson={main}
//         domain={domain}
//         setMainJson={setJson(domain, element)}
//         selectDomainLoadAndRenderIntoElement={selectDomainLoadAndRenderIntoElement}/>, element);
// }

interface DomainMap {
    game: GameDomain<GameData>,
    simpleGame: SimpleGameDomain<React.ReactElement, GameData>,
    cpq: CpqDomain
}
let navDomain = new NavDomain(cache, selectDomainLoadAndRenderIntoElement, 'target')

let stateLens = Lens.build<GameData>().field('state');
let domainMap: DomainMap = {game: new GameDomain<GameData>(cache, stateLens), simpleGame: new SimpleGameDomain(cache, stateLens), cpq: new CpqDomain(cache)}

function loadAndRenderIntoElement<Domain extends DomainWithCache<Element>, Element>(domain: Domain, element: HTMLElement): (url: string) => Promise<void> {
    return url => fetch(url).then(r => r.json()).then(json => {
        console.log('setting json', json)
        domain.componentCache.loadFromBlob(json).then(() => {
            LensContext.setJson(domain, element, c =>
                ReactDOM.render(<ComponentFromServer<any, any, any, React.ReactElement> context={c}/>, element)
            )(json)
        })
    })

}

function selectDomainLoadAndRenderIntoElement<K extends keyof DomainMap>(domainName: K, url: string, name: string) {
    let domain = fromObject(domainMap, domainName);
    let element = getElement(name)
    loadAndRenderIntoElement(domain, element)(url)
}
// selectDomainLoadAndRenderIntoElement('nav', "created/index.json", 'nav')
loadAndRenderIntoElement(navDomain, getElement('nav'))('created/index.json')
selectDomainLoadAndRenderIntoElement('simpleGame', "created/simpleGameJson.json", 'root')
