import {Tuple} from "../utils";
import {Lens} from "./optics";
import {DomainWithCache} from "../componentFromServer/ComponentFromServer";

export interface LensProps<Domain, ReactElement, Main, T> {context: LensContext<Domain, ReactElement, Main, T>}

export class LensContext<Domain, ReactElement, Main, T> {
    /** A place for dependancy injection. The domain contains all those 'global variables' like 'where is my data source'. The domain shouldn't
     * really change across time (although caches are fine)
     */
    domain: Domain
    /** The main java that this chunk of react is rendering */
    main: Main
    /** This should probably not be called by your code. Normally you will use 'setJson' or 'setFromTwo' (if you need to update two parts at the same time */
    dangerouslySetMain: (m: Main) => void
    /** A lens from the main blob of json to the 'bit that this context is focused on' */
    lens: Lens<Main, T>

    constructor(domain: Domain, main: Main, setMain: (m: Main) => void, lens: Lens<Main, T>) {
        this.domain = domain
        this.main = main;
        this.dangerouslySetMain = setMain;
        this.lens = lens;
    }

    /** If just 'walking down the json' using field names this is great. The parameter 'fieldName' is a 'key' of the current focused place,
     * and this returns a new context focused on the json under the field name */
    focusOn<K extends keyof T>(fieldName: K): LensContext<Domain, ReactElement, Main, T[K]> {return this.withLens(Lens.build<T>().then(fieldName))}

    /** When we want to focus on something like 'the nth item' then 'withLens' is used. This returns a context focused on the block of json under the lens starting from 'here' */
    withLens<NewT>(lens: Lens<T, NewT>): LensContext<Domain, ReactElement, Main, NewT> {return new LensContext(this.domain, this.main, this.dangerouslySetMain, this.lens.andThen(lens))}

    /** The json that this context is focused on */
    json(): T {return this.lens.get(this.main)}

    /** How we edit the json that this is focused on: we call setJson and that will make a new main json with the bit passed in placing the json that we are focused on
     *
     * If you only want to change a little bit of this json then 'setFrom' can be used*/
    setJson(json: T) {this.dangerouslySetMain(this.lens.set(this.main, json))}
    render<Element>(fn: (context: LensContext<Domain, Element, Main, T>) => Element) {return fn(this)}
    setFrom<Child>(lens: Lens<T, Child>, json: Child) {this.dangerouslySetMain(this.lens.andThen(lens).set(this.main, json))}
    setFromTwo<Other>(lens: Lens<Main, Other>) {return (fn: (t: T, o: Other) => Tuple<T, Other>) => this.dangerouslySetMain(Lens.transform2(this.lens, lens)(fn)(this.main))}


    /** This is the 'make it so that when I change the json things get rendered properly' configuration
     *
     * Example
     * LensContext.setJson<Domain, React.ReactElement, GameData>(gameDomain, element, c => (ReactDOM.render(<SimpleGame context={c}/>, element)))
     *
     * The 'setJson' method is used to render a react component onto a html element. Whenever the json is changed by the child components, suitable rendering takes place
     */
    static setJson = <Domain, ReactElement, Main>(domain: Domain, element: HTMLElement, fn: (lc: LensContext<Domain, ReactElement, Main, Main>) => void): (m: Main) => void =>
        (main: Main) => {
            console.log('setJson', main)
            return fn(new LensContext(domain, main, LensContext.setJson(domain, element, fn), Lens.identity()));
        }

    static loadAndRenderIntoElement<Domain extends DomainWithCache<ReactElement>, Main, ReactElement>(domain: Domain, html: HTMLElement, processContext: (c: LensContext<Domain, ReactElement, Main, Main>, html: HTMLElement) => void): (url: string) => Promise<void> {
        return url => {
            console.log("fetching", url)
            return fetch(url).then(r => r.json()).then(json => {
                console.log('setting json', json)
                domain.componentCache.loadFromBlob(json).then(() => LensContext.setJson<Domain, ReactElement, Main>(domain, html, c => processContext(c, html))(json))
            })
        }
    }
}

