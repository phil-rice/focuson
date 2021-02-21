//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import React from 'react';

import {enzymeSetup} from './enzymeAdapterSetup';
import {shallow, ShallowWrapper} from "enzyme";

import {focusOnNth, lensContext, LensContext} from "../../../../modules/lens"; //changed from @phil-rice/lens;
import {Board, BoardData, GameData, nextStateLens, SimpleGame, Square} from "./game";


enzymeSetup()

let boardJson: BoardData = {"squares": ["X", "", "", "", "", "", "", "", ""]}

let gameJson: GameData = {"board": boardJson, next: 'X'}

function setJson(json: GameData): void {throw new Error('should not be called')}

let context = lensContext<GameData>(gameJson, setJson, 'game')
function squareContext(context: LensContext<GameData, GameData>, n: number) {
    let squaresContext = context.focusOn('board').focusOn('squares');
    return focusOnNth(squaresContext, n)
}

function compare<Domain, Main, Data>(wrapper: ShallowWrapper<any, React.Component["state"], React.Component>, context: LensContext<Main, Data>, expectedLensDescription: string) {
    let props: any = wrapper.props()
    let childContext: LensContext<Main, Data> = props.context
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
            let context = lensContext<GameData>(gameJson, setJson, 'game')
            const square = shallow(<Square context={squareContext(context, 1)}/>)
            square.simulate('click')
            expect(setJson.mock.calls.length).toBe(1)
            let data: GameData = setJson.mock.calls[0][0]
            expect(data.next).toBe('O') // inverted
            expect(data.board.squares[1]).toBe('X')
        })
    })
})
