import React from "react";
import {NavGroupData, NavProperties, NavRest} from "../domain/NavDomain";


function NavGroup<Parent>(rest: NavRest<Parent, NavGroupData>): (props: NavProperties) => React.ReactElement {
    return props => {
        let name = rest.json().name
        let group = rest.json().jsonFiles.map((url, i) => (<li key={url}><a onClick={() => rest.domain().loadUrlAndPutInElement(name, url, 'root')}>{url}</a></li>))
        return (<React.Fragment>
            <li key={'groupName'}>{rest.json().name}</li>
            <ul key={'navGroup' + name}>{group}</ul>
        </React.Fragment>)
    }
}
