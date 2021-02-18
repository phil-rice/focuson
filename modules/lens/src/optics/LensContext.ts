//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Tuple} from "../utils";
import {Lens} from "./Lens";


export interface LensProps<Domain, Main, T> {
    context: LensContext<Domain, Main, T>
}

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

    static main<Domain, Main>(domain: Domain, main: Main, setMain: (m: Main) => void, description: string): LensContext<Domain, Main, Main> {
        return new LensContext(domain, main, setMain, Lens.identity<Main>().withDescription(description))
    }

    asTuple1<Two>(twoL: Lens<Main, Two>): LensContext<Domain, Main, Tuple<T, Two>> {
        return this.withLens(Lens.tupleLens(this.lens, twoL))
    }

    asTuple2<One>(oneL: Lens<Main, One>): LensContext<Domain, Main, Tuple<One, T>> {
        return this.withLens(Lens.tupleLens(oneL, this.lens))
    }


    constructor(domain: Domain, main: Main, setMain: (m: Main) => void, lens: Lens<Main, T>) {
        this.domain = domain
        this.main = main;
        this.dangerouslySetMain = setMain;
        this.lens = lens;
    }

    /** If just 'walking down the json' using field names this is great. The parameter 'fieldName' is a 'key' of the current focused place,
     * and this returns a new context focused on the json under the field name */
    focusOn<K extends keyof T>(fieldName: K): LensContext<Domain, Main, T[K]> {
        return this.withLens(this.lens.focusOn(fieldName))
    }

    /** When we want to focus on something like 'the nth item' then 'withChildLens' is used. This returns a context focused on the block of json under the lens passed in */
    withLens<NewT>(lens: Lens<Main, NewT>): LensContext<Domain, Main, NewT> {
        return new LensContext(this.domain, this.main, this.dangerouslySetMain, lens)
    }

    /** When we want to focus on something like 'the nth item' then 'withChildLens' is used. This returns a context focused on the block of json under the lens starting from 'here' */
    withChildLens<NewT>(lens: Lens<T, NewT>): LensContext<Domain, Main, NewT> {
        return new LensContext(this.domain, this.main, this.dangerouslySetMain, this.lens.andThen(lens))
    }

    composeWith<NewT>(fn: (l: Lens<Main, T>) => Lens<Main, NewT>): LensContext<Domain, Main, NewT> {
        return this.withLens(fn(this.lens))
    }

    /** The json that this context is focused on */
    json(): T {
        return this.lens.get(this.main)
    }

    transform(fn: (t: T) => T) {
        this.setJson(fn(this.json()))
    }

    jsonFromLens<Child>(lens: Lens<Main, Child>) {
        return lens.get(this.main)
    }

    /** How we edit the json that this is focused on: we call setJson and that will make a new main json with the bit passed in placing the json that we are focused on
     *
     * If you only want to change a little bit of this json then 'setFrom' can be used*/
    setJson(json: T) {
        this.dangerouslySetMain(this.lens.set(this.main, json))
    }

    setFrom<Child>(lens: Lens<T, Child>, json: Child) {
        this.dangerouslySetMain(this.lens.andThen(lens).set(this.main, json))
    }

    setFromTwoFn<Other>(lens: Lens<Main, Other>) {
        return (fn: (t: T, o: Other) => Tuple<T, Other>) => this.dangerouslySetMain(Lens.transform2(this.lens, lens)(fn)(this.main))
    }

    setFromTwo<Other>(lens: Lens<Main, Other>, json: T, other: Other) {
        this.dangerouslySetMain(this.lens.set(lens.set(this.main, other), json))
    }

    withSetMain(setMain: (m: Main) => void): LensContext<Domain, Main, T> {
        return new LensContext(this.domain, this.main, setMain, this.lens)
    }

    /** This is the code that enables us to use lens with react. Note that this project doesn't actually use React, as it is
     * independent of the version of react used. An example of it's use is
     *
     * let setJson = LensContext.setJsonForReact<GameDomain, GameData>(domain, c => (ReactDOM.render(<SimpleGame context={c}/>, rootElement)))
     *
     * This creates a function that we can pass json to, and that json will be rendered */

    static setJsonForReact = <Domain, Main>(domain: Domain, description: string,
                                            fn: (lc: LensContext<Domain, Main, Main>) => void,
                                            transformJson: (m: Main) => Promise<Main> = m => Promise.resolve(m)): (m: Main) => void =>
        (main: Main) => transformJson(main).then(processedMain =>
            fn(LensContext.main(domain, processedMain, LensContext.setJsonForReact(domain, description, fn, transformJson), description)))

    /** This is the code that enables us to use lens with the story book project. For this we need to return the component.
     * Unlike the setJsonForReact here is no need to transform the json. An example of it's use is
     * let setJson: GameData => Component = LensContext.setJsonForStoryBook<GameDomain, GameData>(domain, c => (<SimpleGame context={c}/>)))
     *
     * This creates a function that we can pass json to, and that json will be rendered */

    static setJsonForStoryBook = <Domain, Main, Result>(domain: Domain, description: string,
                                                        fn: (lc: LensContext<Domain, Main, Main>) => Result): (m: Main) => Result =>
        (main: Main) => fn(LensContext.main(domain, main, LensContext.setJsonForStoryBook(domain, description, fn), description))

    withNewDomain<NewDomain, NewMain>(getDomain: (d: Domain) => NewDomain, lens: Lens<Main, NewMain>): LensContext<NewDomain, NewMain, NewMain> {
        return new LensContext<NewDomain, NewMain, NewMain>(
            getDomain(this.domain),
            lens.get(this.main),
            (m: NewMain) => this.dangerouslySetMain(lens.set(this.main, m)),
            Lens.identity())
    }
}

