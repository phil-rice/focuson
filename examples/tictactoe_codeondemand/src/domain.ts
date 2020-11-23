import {Lens} from "../../../lens/src/optics/Lens";
import {LensProps} from "../../../lens/src/optics/LensContext";
import {Tuple} from "../../../lens/src/utils";

export class GameDomain {
    stateLens: Lens<GameData, NoughtOrCross> = Lens.build<GameData>().then('state');
    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')};
    setSquareAndToggleState(square: NoughtOrCross, state: NoughtOrCross): Tuple<NoughtOrCross, NoughtOrCross> {
        return (square === '') ? ({one: state, two: this.invert(state)}) : ({one: square, two: state})
    }
}


export type GameProps<T> = LensProps<GameDomain, GameData, T>
export type NoughtOrCross = "O" | "X" | ""

export interface GameData {
    state: NoughtOrCross
    _embedded: { board: BoardData }
}
export interface BoardData {
    squares: SquareData
}
export type SquareData = NoughtOrCross[]