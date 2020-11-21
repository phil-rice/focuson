import {Tuple} from "../utils";
import {Lens} from "./optics";
import {ComponentFromServer, DomainWithCache} from "../reactrest/ComponentFromServer";
import ReactDOM from "react-dom";
import React from "react";

export interface LensProps<Domain, ReactElement, Main, T> {context: LensContext<Domain, ReactElement, Main, T>}

export class LensContext<Domain, ReactElement, Main, T> {
    domain: Domain
    main: Main
    setMain: (m: Main) => void
    lens: Lens<Main, T>


    constructor(domain: Domain, main: Main, setMain: (m: Main) => void, lens: Lens<Main, T>) {
        this.domain = domain
        this.main = main;
        this.setMain = setMain;
        this.lens = lens;
    }
    withLens<NewT>(lens: Lens<T, NewT>): LensContext<Domain, ReactElement, Main, NewT> {return new LensContext(this.domain, this.main, this.setMain, this.lens.andThen(lens))}
    focusOn<K extends keyof T>(k: K): LensContext<Domain, ReactElement, Main, T[K]> {return this.withLens(Lens.build<T>().then(k))}
    json(): T {return this.lens.get(this.main)}
    setJson(json: T) {this.setMain(this.lens.set(this.main, json))}
    render<Element>(fn: (context: LensContext<Domain, Element, Main, T>) => Element) {return fn(this)}
    setFrom<Child>(lens: Lens<T, Child>, json: Child) {this.setMain(this.lens.andThen(lens).set(this.main, json))}
    setFromTwo<Other>(lens: Lens<Main, Other>) {return (fn: (t: T, o: Other) => Tuple<T, Other>) => this.setMain(Lens.transform2(this.lens, lens)(fn)(this.main))}

    static setJson = <Domain, ReactElement, Main>(domain: Domain, element: HTMLElement, fn: (lc: LensContext<Domain, ReactElement, Main, Main>) => void): (m: Main) => void =>
        (main: Main) => {
            console.log('setJson', main)
            return fn(new LensContext(domain, main, LensContext.setJson(domain, element, fn), Lens.identity()));
        }

    static loadAndRenderIntoElement<Domain extends DomainWithCache<ReactElement>, ReactElement>(domain: Domain, html: HTMLElement, processContext: <Main>(c: LensContext<Domain, ReactElement, Main, Main>, html: HTMLElement) => void): (url: string) => Promise<void> {
        return url => {
            console.log("fetching", url)
            return fetch(url).then(r => r.json()).then(json => {
                console.log('setting json', json)
                domain.componentCache.loadFromBlob(json).then(() => LensContext.setJson(domain, html, c => processContext(c, html))(json))
            })
        }
    }
}

