import './index.css';
import ReactDOM from 'react-dom';
// import Sample from './sample';

import { getElement, LensContext } from "@phil-rice/lens";

import { Nav } from "@phil-rice/nav";
import { Cpq, CpqData, CpqDomain } from "./Cpq";

let rootElement = getElement('root')

let fetchUrl: (url: string) => Promise<CpqData> = (url: string) => fetch(url).then(r => r.json())
let setJsonForReact: <Domain, Main>(domain: Domain, description: string, fn: (lc: LensContext<Domain, Main, Main>) => void) => (m: Main) => void = LensContext.setJsonForReact

fetch("json/index.json").then(j => j.json()).then(jsonFiles => {
    console.log("fetched for nav", jsonFiles)
    let cpqDomain = new CpqDomain()
    let setJson: (m: CpqData) => void = setJsonForReact(cpqDomain, 'cpq', (c: LensContext<CpqDomain, CpqData, CpqData>) => {
        console.log("settingJson to", c.json())
        console.log("jsonFiles is", jsonFiles)
        ReactDOM.render(
            <div className={'main container-fluid pl-0 pr-0'}>
                <Nav jsonFiles={jsonFiles.jsonFiles} fetch={fetchUrl} setData={setJson} />
                <Cpq context={c} />
            </div>, rootElement)
    })
    console.log("loading", jsonFiles.jsonFiles[0])
    fetchUrl(jsonFiles.jsonFiles[0]).then(setJson)
})

// ReactDOM.render(<Sample></Sample>, document.getElementById('root'));




