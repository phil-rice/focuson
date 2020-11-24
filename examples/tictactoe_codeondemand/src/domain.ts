import {Lens, LensProps, Tuple} from "@phil-rice/lens";


export class GameDomain {
    stateLens: Lens<GameData, NoughtOrCross> = Lens.build<GameData>('game').then('state');
    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')};
    setSquareAndInvertNext<Main>(props: GameProps<NoughtOrCross>) {
        console.log('setting')
        let context = props.context
        let domain = context.domain;
        let next = context.jsonFromLens(domain.stateLens)
        if (context.json() === '')
            context.setFromTwo(domain.stateLens, next, domain.invert(next))
    }
}


export type GameProps<T> = LensProps<GameDomain, GameData, T>
export type NoughtOrCross = "O" | "X" | ""

export interface GameData {
    state: NoughtOrCross,
    _embedded: { board: BoardData }
}
export interface BoardData {
    squares: SquareData
}
export type SquareData = NoughtOrCross[]