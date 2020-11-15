import React from "react";
import {RestContext} from "./reactRest";
import {identity} from "./utils";


export function RestRoot(props: any) {
    let reactRest = props.reactRest;
    // @ts-ignore //TODO Need to understand this and fix it
    const [state, dispatch] = React.useReducer(RestContext)

    let setJsonFromUrl: (url: string) => Promise<void> = (url: string) => {
        return fetch(url).then(response => response.json().then(json => {
                console.log("and got", json)
                // setJson(json)
            }
        ))
    }
    return (<RestContext.Provider value={{
        reactRest: reactRest,
        json: props.json,
        setJson: setJsonFromUrl
    }}>
        {reactRest.renderSelf(identity)}
    </RestContext.Provider>)
}

export function Rest(props: any) {
    return (<RestContext.Consumer>{context => {
        let reactRest = context.reactRest;
        if (!reactRest) throw Error('Context should have a reactRest')
        return reactRest.renderSelf(props)
    }}</RestContext.Consumer>)
}

