import React, {ReactElement} from 'react';
import {LoadAndCompileCache} from "./LoadAndCompileCache";
import {ReactRestState} from "./ReactRestState";

type Getter = (json: any) => any

/** Element is usually React.ReactElement */
export class ReactRest<Element> {
    private create: (clazz: any, props: any) =>Element;
    private loadAndCompileCache: LoadAndCompileCache;
    private json: any;
    /** Create will usually be React.createElement. Using it via dependency inject to allow testing more easily, and because that decouples this from React
     * reactCache will turn a url into a string. It is 'expected' that this securely changes the url into a string (checking the sha) and has been preloaded because we can't do async in the rendering  */
    constructor(create: (clazz: any, props: any) => Element, loadAndCompileCache: LoadAndCompileCache, json: any) {
        this.create = create
        this.loadAndCompileCache = loadAndCompileCache
        this.json = json
    }

    renderSelf(getter: Getter): Element {
        return this.renderUsing("_self", getter)
    }

    renderUrl(name: string, getter: Getter): string {
        let obj = getter(this.json)
        if (obj._render && name in obj._render) return obj._render[name]
        throw `Cannot find renderUrl for  ${name}`
    }

    renderUsing(name: string, getter: Getter): Element {
        var renderUrl = this.renderUrl(name, getter)
        var renderClass = this.loadAndCompileCache.getFromCache(renderUrl)
        return this.create(renderClass, {getter: getter})
    }
}


export const RestContext: React.Context<ReactRestState> = React.createContext({} )
