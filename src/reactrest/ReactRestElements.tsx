import React from "react";

import {checkIsFunction, identity} from "./utils";
import {RestContext} from "./LoadAndCompileCache";
import {HasGetter, ReactRest} from "./reactRest";
import {isFunction} from "util";

export interface RestRootProperties {
    json: any,
    reactRest: ReactRest<React.ReactElement>
}

export function RestRoot(props: RestRootProperties) {
    console.log("Rendering RestRoot", props)

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
        {reactRest.renderSelf({getter: identity})}
    </RestContext.Provider>)
}

export interface RestProperties extends HasGetter {}

export function Rest(props: RestProperties) {
    console.log("Rendering Rest", props)
    checkIsFunction(props.getter)
    return (<RestContext.Consumer>{context => {
        let reactRest = context.reactRest;
        if (!reactRest) throw Error('Context should have a reactRest')
        return reactRest.renderSelf(props)
    }}</RestContext.Consumer>)
}

