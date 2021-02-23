//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import ReactDOM from 'react-dom';

import {SHA256} from 'crypto-js'
import {getElement, setJsonForFlux} from "@phil-rice/state";
import {ComponentFromServer, LoadAndCompileCache, MakeComponentFromServer} from "@phil-rice/codeondemand";
import React from "react";
import {CpqData} from "./CpqDomain";
import {Nav} from "@phil-rice/nav";


let cache = LoadAndCompileCache.create<MakeComponentFromServer<React.ReactElement>>((s: string) => SHA256(s).toString())

let element = getElement('root')


function fetchData(url: string): Promise<CpqData> { return fetch(url).then(r => r.json())}

fetch("created/index.json").then(j => j.json()).then(indexJson => {
    let jsonFiles: string[] = indexJson.jsonFiles
    console.log("fetched for nav", indexJson, jsonFiles)
    function setJson(cpqData: CpqData) {
        console.log("setJson", cpqData)
        cache.loadFromBlob(cpqData).then(() =>
            setJsonForFlux( 'cpq',
                c => ReactDOM.render(
                    <div>
                        <Nav jsonFiles={jsonFiles} fetch={fetchData} setData={setJson}></Nav>
                        <ComponentFromServer state={c}/>
                    </div>, element))(cpqData))
    }
    fetchData(jsonFiles[0]).then(setJson)
})


