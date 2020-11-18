import {lens, Lens} from "../reactrest/utils";

export interface Link {
    href: string
}
export interface SelfLink {
    _links: { _self: Link }
}

export interface GameData extends SelfLink {
    _embedded: { board: BoardData }
    _render: { _self: string }
    _links: { _self: Link, game1: Link, game2: Link }
}

export interface BoardData extends SelfLink {
    squares: SquareData
    _render: { _self: string, square: string }
}
export type    SquareData = number[]


export class Domain {
    gameToBoardL: Lens<GameData, BoardData> = lens(g => g._embedded.board, (g, board) => ({...g, board}))
    boardToSquaresL: Lens<BoardData, SquareData> = lens(b => b.squares, (b, squares) => ({...b, squares}))
    gameToSquaresL = this.gameToBoardL.andThen(this.boardToSquaresL);
    boardToNthL(n: number): Lens<BoardData, number> {return this.boardToSquaresL.andThen(Lens.nth(n))}
    gameToSquareL(n: number): Lens<GameData, number> { return this.gameToBoardL.andThen(this.boardToSquaresL).andThen(Lens.nth(n))}

}
