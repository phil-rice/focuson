//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import './index.css';
import {getElement, setJsonForFlux} from "@focuson/state";
import {Nav} from "@focuson/nav";
import {Cpq, CpqData} from "./Cpq";
import ReactDOM from 'react-dom';

let rootElement = getElement('root')

let fetchUrl: (url: string) => Promise<CpqData> = (url: string) => fetch(url).then(r => r.json())

fetch("json/index.json").then(j => j.json()).then(jsonFiles => {
    console.log("fetched for nav", jsonFiles)
    let setJson: (m: CpqData) => void = setJsonForFlux('cpq', s => {
        console.log("settingJson to", s.json())
        console.log("jsonFiles is", jsonFiles)
        ReactDOM.render(
            <div className={'main container-fluid'}>
                <Nav jsonFiles={jsonFiles.jsonFiles} fetch={fetchUrl} setData={setJson}/>
                <Cpq state={s}/>
            </div>, rootElement)
    })
    console.log("loading", jsonFiles.jsonFiles[0])
    fetchUrl(jsonFiles.jsonFiles[0]).then(setJson)
})




