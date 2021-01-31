import React from 'react';

import {enzymeSetup} from './enzymeAdapterSetup';
import {shallow, ShallowWrapper} from "enzyme";

import {Lens, LensContext} from "@phil-rice/lens";
import {Board, BoardData, GameData, GameDomain, nextStateLens, SimpleGame, Square} from "./game";


enzymeSetup()

let boardJson: BoardData = {"squares": ["X", "", "", "", "", "", "", "", ""]}

let gameJson: GameData = {"board": boardJson, next: 'X'}

function setJson(json: GameData): void {throw new Error('should not be called')}

let cache: any = ''//this isn't used and it's ok if it throws errors as that will indicate test failuer
let domain = new GameDomain(nextStateLens)
let context = LensContext.main <GameDomain, GameData>(domain, gameJson, setJson, 'game')
function squareContext(context: LensContext<GameDomain, GameData, GameData>, n: number) {
    return context.focusOn('board').focusOn('squares').withChildLens(Lens.nth(n))
}

function compare<Domain, Main, Data>(wrapper: ShallowWrapper<any, React.Component["state"], React.Component>, context: LensContext<Domain, Main, Data>, expectedLensDescription: string) {
    let props: any = wrapper.props()
    let childContext: LensContext<Domain, Main, Data> = props.context
    expect(childContext.domain).toBe(domain)
    expect(childContext.lens.description).toBe(expectedLensDescription)
    expect(childContext.main).toBe(context.main)
    expect(childContext.dangerouslySetMain).toBe(context.dangerouslySetMain)

}

describe("Tictactoe", () => {
    describe("SimpleGame", () => {
        it("should render", () => {
            const game = shallow(<SimpleGame context={context}/>)
            console.log("game", game.text())

            expect(game.find('NextMove')).toHaveLength(1)
            compare(game.find('NextMove').at(0), context, 'game/next')

            expect(game.find('Board')).toHaveLength(1)
            compare(game.find('Board').at(0), context, 'game/board')
        })
    })
    describe("board", () => {
        it("should render", () => {
            const board = shallow(<Board context={context.focusOn('board')}/>)
            let componentSquares = board.find('Square');
            expect(componentSquares).toHaveLength(9)
            componentSquares.forEach((square, i) =>
                compare(square, context, `game/board/squares/[${i}]`))
        })
    })
    describe("square", () => {
        it("should render", () => {
            const square = shallow(<Square context={squareContext(context, 0)}/>)
            expect(square.text()).toEqual('X')
        })

        it("should have an onclick that inverts the state, and sets the square with the current state", () => {
            let setJson = jest.fn()
            let context = LensContext.main <GameDomain, GameData>(domain, gameJson, setJson, 'game')
            const square = shallow(<Square context={squareContext(context, 1)}/>)
            square.simulate('click')
            expect(setJson.mock.calls.length).toBe(1)
            let data: GameData = setJson.mock.calls[0][0]
            expect(data.next).toBe('O') // inverted
            expect(data.board.squares[1]).toBe('X')
        })
    })
})
