import ReactDOM from 'react-dom';
import './index.css';
import {SHA256} from 'crypto-js'
import {getElement} from "@phil-rice/lens";
import {ComponentFromServer, LoadAndCompileCache, loadAndRenderIntoElement, MakeComponentFromServer} from "@phil-rice/codeondemand";
import React from "react";
import {CpqData, CpqDomain} from "./CpqDomain";

let cache = LoadAndCompileCache.create<MakeComponentFromServer<React.ReactElement>>((s: string) => SHA256(s).toString())

function setJson(url: string) {
    return loadAndRenderIntoElement<React.ReactElement, CpqDomain, CpqData>(gameDomain, 'cpq',
        c => ReactDOM.render(<ComponentFromServer context={c}/>, element))(url)
}
let gameDomain: CpqDomain = new CpqDomain(cache)
let element = getElement('root')

setJson('created/cpqJson1.json')


