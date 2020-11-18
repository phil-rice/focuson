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
    nextState: NoughtOrCross
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
    gameToNextStateL: Lens<GameData, NoughtOrCross> = lens(g => g.nextState, (g, nextState) => ({...g, nextState}))
    boardToSquaresL: Lens<BoardData, SquareData> = lens(b => b.squares, (b, squares) => ({...b, squares}))
    gameToSquaresL = this.gameToBoardL.andThen(this.boardToSquaresL);
    boardToNthL(n: number): Lens<BoardData, string> {return this.boardToSquaresL.andThen(Lens.nth(n))}
    gameToSquareL(n: number): Lens<GameData, string> {return this.gameToBoardL.andThen(this.boardToSquaresL).andThen(Lens.nth(n))}
    withState = <T>(lens: Lens<GameData, T>) => liftToWithState(this.gameToNextStateL, lens)
    mapStateLens<Parent, Child>(lens: Lens<Parent, Child>) {return mapLens<NoughtOrCross, Parent, Child>(lens)}
}

export interface WithState<State, T> {
    state: State
    value: T
}
function liftToWithState<Main, T, State>(stateLens: Lens<Main, State>, lens: Lens<Main, T>): Lens<Main, WithState<State, T>> {
    let get = (main: Main) => ({state: stateLens.get(main), value: lens.get(main)})
    let set = (main: Main, w: WithState<State, T>) => lens.set(stateLens.set(main, w.state), w.value)
    return new Lens(get, set)
}
function mapLens<State, Parent, Child>(l: Lens<Parent, Child>): Lens<WithState<State, Parent>, WithState<State, Child>> {
    let get = (main: WithState<State, Parent>) => ({state: main.state, value: l.get(main.value)})
    let set = (main: WithState<State, Parent>, child: WithState<State, Child>) => ({state: child.state, value: l.set(main.value, child.value)})
    return new Lens(get, set)
}
