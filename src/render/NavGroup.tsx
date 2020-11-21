import React from "react";
import {NavGroupData, NavProperties} from "../domain/NavDomain";

function NavGroup<DomainMap, Main>(props: NavProperties<DomainMap, Main, NavGroupData>) {
    let name = props.context.json().name
    let group = props.context.json().jsonFiles.map((url, i) =>
        (<li key={url}><a onClick={() => {
            console.log("onclick", name, url)
            // @ts-ignore //TODO consider how to remove this... how do we check that the name is legit? Or do we care? because we have a run time check with message anyway...
            return props.context.domain.loadUrlAndPutInElement(name, url, 'root')
        }}>{url}</a></li>))
    return (<React.Fragment>
        <li key={'groupName'}>{props.context.json().name}</li>
        <ul key={'navGroup' + name}>{group}</ul>
    </React.Fragment>)

}
