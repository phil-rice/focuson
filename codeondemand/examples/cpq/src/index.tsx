import ReactDOM from 'react-dom';
import './index.css';
import { SHA256 } from 'crypto-js'
import { getElement, LensContext } from "@phil-rice/lens";
import { ComponentFromServer, LoadAndCompileCache, loadAndRenderIntoElement, MakeComponentFromServer } from "@phil-rice/codeondemand";
import React from "react";
import { CpqData, CpqDomain } from "./CpqDomain";
import { Nav, NavData, NavDomain } from "@phil-rice/codeondemand_nav";


let cache = LoadAndCompileCache.create<MakeComponentFromServer<React.ReactElement>>((s: string) => SHA256(s).toString())

let navSetMain = (j: any) => { throw new Error('Should not try and set nav json') }
let cpqDomain: CpqDomain = new CpqDomain(cache)
let element = getElement('root')


fetch("created/index.json").then(j => j.json()).then(json => {
    console.log("fetched for nav", json)
    let navData: NavData = json
    function setJson(url: string): Promise<void> {
        return loadAndRenderIntoElement<React.ReactElement, CpqDomain, CpqData>(cpqDomain, 'cpq',
            c => ReactDOM.render(
                <div>
                    <Nav context={navContext}></Nav>
                    <ComponentFromServer context={c} />
                </div>, element))(url)
    }
    let navDomain = new NavDomain(setJson)
    let navContext: LensContext<NavDomain, NavData, NavData> = LensContext.main(navDomain, navData, navSetMain, 'nav')
    let url = navContext.json().groups[0].jsonFiles[0];
    console.log(url)
    return setJson(url)
})


