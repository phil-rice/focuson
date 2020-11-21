import {Tuple} from "../utils";
import {Lens} from "./optics";

export interface LensProps<Domain, Main, T> {context: LensContext<Domain, Main, T>}

export class LensContext<Domain, Main, T> {
    domain: Domain
    main: Main
    setMain: (m: Main) => void
    lens: Lens<Main, T>
    static setJson = <Domain, Main, Element>(domain: Domain, element: Element, fn: (lc: LensContext<Domain, Main, Main>) => Element): (m: Main) => void =>
        (game: Main) => fn(new LensContext(domain, game, LensContext.setJson(domain, element, fn), Lens.identity()));

    constructor(domain: Domain, main: Main, setMain: (m: Main) => void, lens: Lens<Main, T>) {
        this.domain = domain
        this.main = main;
        this.setMain = setMain;
        this.lens = lens;
    }
    withLens<NewT>(lens: Lens<T, NewT>): LensContext<Domain, Main, NewT> {return new LensContext(this.domain, this.main, this.setMain, this.lens.andThen(lens))}
    focusOn<K extends keyof T>(k: K): LensContext<Domain, Main, T[K]> {return this.withLens(Lens.build<T>().then(k))}
    json(): T {return this.lens.get(this.main)}
    setJson(json: T) {this.setMain(this.lens.set(this.main, json))}
    render<Element>(fn: (context: LensContext<Domain, Main, T>) => Element) {return fn(this)}
    setFromTwo<Other>(lens: Lens<Main, Other>) {return (fn: (t: T, o: Other) => Tuple<T, Other>) => Lens.transform2(this.lens, lens)(fn)(this.main)}
}

