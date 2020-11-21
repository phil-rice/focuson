import {Lens} from "../optics/optics";
import {NoughtOrCross} from "./GameDomain";
import {LensContext, LensProps} from "../optics/LensContext";

export type GameProps<Main, T> = LensProps<GDomain<Main>, Main, T>

export class GDomain<Main> {
    stateLens: Lens<Main, NoughtOrCross>

    constructor(stateLens: Lens<Main, NoughtOrCross>) {
        this.stateLens = stateLens;
    }
    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

    setSquareAndToggleState = (context: LensContext<GDomain<Main>, Main, NoughtOrCross>) =>
        Lens.transform2(context.lens, this.stateLens)((sq, state) =>
            sq === '' ? {one: state, two: this.invert(state)} : {one: sq, two: state})(context.main)

}