import {lens, Lens} from "../reactrest/utils";

export interface Link {
    href: string
}
export interface SelfLink {
    _links: { _self: Link }
}
export type NoughtOrCross = "O" | "X" | ""
export interface GameData extends SelfLink {
    _embedded: { board: BoardData }
    _render: { _self: string }
    _links: { _self: Link, game1: Link, game2: Link }
}

export interface BoardData extends SelfLink {
    squares: SquareData
    _render: { _self: string, square: string }
}
export type    SquareData = string[]


export class Domain {
    nextState: NoughtOrCross = "X"
    toggleNextState() {return this.nextState = (this.nextState === "X") ? "O" : "X"}
    getAndToggleNextState(): NoughtOrCross {
        let result = this.nextState;
        this.toggleNextState();
        return result;
    }
    gameToBoardL: Lens<GameData, BoardData> = lens((g: GameData) => g._embedded, (g, _embedded) => ({...g, _embedded})).andThen(lens(g => g.board, (g, board) => ({...g, board})))
    boardToSquaresL: Lens<BoardData, SquareData> = lens(b => b.squares, (b, squares) => ({...b, squares}))
    boardToNthL(n: number): Lens<BoardData, string> {return this.boardToSquaresL.andThen(Lens.nth(n))}
}

