import React from "react";
import {NavGroupData, NavProperties, NavRest} from "../domain/NavDomain";


function NavGroup<Parent>(rest: NavRest<Parent, NavGroupData>): (props: NavProperties<Parent>) => React.ReactElement {
    return props => {
        console.log("loadUrlAndPutInElement", props.loadUrlAndPutInElement)
        let name = rest.json().name
        let group = rest.json().jsonFiles.map((url, i) => (<li key={url}><a onClick={() => props.loadUrlAndPutInElement(url, name)}>{url}</a></li>))
        return (<React.Fragment>
            <li key={'groupName'}>{rest.json().name}</li>
            <ul key={'navGroup' + name}>
                {group}
            </ul>
        </React.Fragment>)
    }
}
