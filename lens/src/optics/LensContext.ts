import {Tuple} from "../utils";
import {Lens} from "./Lens";



export interface LensProps<Domain, Main, T> {context: LensContext<Domain, Main, T>}

export class LensContext<Domain, Main, T> {
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

    static main<Domain, Main>(domain: Domain, main: Main, setMain: (m: Main) => void, description: string): LensContext<Domain, Main, Main> {return new LensContext(domain, main, setMain, Lens.identity<Main>().withDescription(description))}

    constructor(domain: Domain, main: Main, setMain: (m: Main) => void, lens: Lens<Main, T>) {
        this.domain = domain
        this.main = main;
        this.dangerouslySetMain = setMain;
        this.lens = lens;
    }

    /** If just 'walking down the json' using field names this is great. The parameter 'fieldName' is a 'key' of the current focused place,
     * and this returns a new context focused on the json under the field name */
    focusOn<K extends keyof T>(fieldName: K): LensContext<Domain, Main, T[K]> {return this.withLens(this.lens.then(fieldName))}

    /** When we want to focus on something like 'the nth item' then 'withChildLens' is used. This returns a context focused on the block of json under the lens passed in */
    withLens<NewT>(lens: Lens<Main, NewT>): LensContext<Domain, Main, NewT> {return new LensContext(this.domain, this.main, this.dangerouslySetMain, lens)}

    /** When we want to focus on something like 'the nth item' then 'withChildLens' is used. This returns a context focused on the block of json under the lens starting from 'here' */
    withChildLens<NewT>(lens: Lens<T, NewT>): LensContext<Domain, Main, NewT> {return new LensContext(this.domain, this.main, this.dangerouslySetMain, this.lens.andThen(lens))}

    /** The json that this context is focused on */
    json(): T {return this.lens.get(this.main)}

    /** How we edit the json that this is focused on: we call setJson and that will make a new main json with the bit passed in placing the json that we are focused on
     *
     * If you only want to change a little bit of this json then 'setFrom' can be used*/
    setJson(json: T) {this.dangerouslySetMain(this.lens.set(this.main, json))}

    setFrom<Child>(lens: Lens<T, Child>, json: Child) {this.dangerouslySetMain(this.lens.andThen(lens).set(this.main, json))}
    setFromTwo<Other>(lens: Lens<Main, Other>) {return (fn: (t: T, o: Other) => Tuple<T, Other>) => this.dangerouslySetMain(Lens.transform2(this.lens, lens)(fn)(this.main))}

    withSetMain(setMain:  (m: Main) => void): LensContext<Domain, Main, T>{
        return new LensContext(this.domain, this.main, setMain, this.lens)
    }
}

