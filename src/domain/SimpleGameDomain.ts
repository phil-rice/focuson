import {Lens} from "../optics/optics";
import {GameData, NoughtOrCross} from "./GameDomain";
import {LensContext, LensProps} from "../optics/LensContext";
import {DomainWithCache, MakeComponentFromServer} from "../reactrest/ComponentFromServer";
import {LoadAndCompileCache} from "../reactrest/LoadAndCompileCache";

export type GameProps<Element, Main, T> = LensProps<SimpleGameDomain<Element, Main>, Element, Main, T>

export class SimpleGameDomain<Element, Main> implements DomainWithCache<Element> {
    componentCache: LoadAndCompileCache<MakeComponentFromServer<Element>>
    stateLens: Lens<Main, NoughtOrCross>

    constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<Element>>, stateLens: Lens<Main, NoughtOrCross>) {
        this.componentCache = componentCache
        this.stateLens = stateLens;
    }

    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

    setSquareAndToggleState = (context: LensContext<SimpleGameDomain<Element, Main>, Element, Main, NoughtOrCross>) =>
        Lens.transform2(context.lens, this.stateLens)((sq, state) =>
            sq === '' ? {one: state, two: this.invert(state)} : {one: sq, two: state})(context.main)

}