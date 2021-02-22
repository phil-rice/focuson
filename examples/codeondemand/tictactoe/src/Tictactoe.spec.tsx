//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import React from 'react';

import {enzymeSetup} from './enzymeAdapterSetup';
import {shallow, ShallowWrapper} from "enzyme";

import {Lenses} from "@phil-rice/lens";
import {LensState, lensState} from "@phil-rice/state";
import {BoardData, GameData} from "./GameDomain";
import {Board} from "./render/Board";
import {Game} from "./render/Game";
import {Square} from "./render/Square";

enzymeSetup()

let boardJson: BoardData = {
    "_render": {
        "_self": "#Board/render#",
        "square": "#Square/render#"
    },
    "squares": ["X", "", "", "", "", "", "", "", ""]
}

let gameJson: GameData = {
    "_links": {
        "game1": {"href": "created/gameJson1.json"},
        "game2": {"href": "created/gameJson2.json"}
    },
    "_render": {"_self": "#Game/render#"},
    "state": "X",
    "_embedded": {
        "board": boardJson
    }
}

function setJson(json: GameData): void {throw new Error('should not be called')}

let cache: any = ''//this isn't used and it's ok if it throws errors as that will indicate test failure
let context = lensState<GameData>(gameJson, setJson, 'game')
function squareContext(context: LensState<GameData, GameData>, n: number) {
    return context.focusOn('_embedded').focusOn('board').focusOn('squares').chainLens(Lenses.nth(n))
}

function compare<Domain, Main, Data>(wrapper: ShallowWrapper<any, React.Component["state"], React.Component>, context: LensState<Main, Data>, expectedLensDescription: string) {
    let props: any = wrapper.props()
    let childContext: LensState<Main, Data> = props.context
    expect(childContext.lens.description).toBe(expectedLensDescription)
    expect(childContext.main).toBe(context.main)
    expect(childContext.dangerouslySetMain).toBe(context.dangerouslySetMain)

}

describe("Tictactoe", () => {
    describe("game", () => {
        it("should render", () => {
            const game = shallow(<Game context={context}/>)
            expect(game.find('LoadGame')).toHaveLength(2)
            let componentServers = game.find('ComponentFromServer');
            expect(componentServers).toHaveLength(1)
            compare(componentServers.at(0), context, 'game/_embedded/board')
        })
    })
    describe("board", () => {
        it("should render", () => {
            const board = shallow(<Board context={context.focusOn('_embedded').focusOn('board')}/>)
            let componentServers = board.find('ChildFromServer');
            expect(componentServers).toHaveLength(9)
            componentServers.forEach((square, i) => compare(square, context, 'game/_embedded/board'))
            componentServers.forEach((square, i) => {
                let props: any = square.props()
                expect(props.lens.description).toBe(`board/squares/[${i}]`)
                expect(props.render).toEqual('square')
            })
        })
    })
    describe("square", () => {
        it("should render", () => {
            const square = shallow(<Square context={squareContext(context, 0)}/>)
            expect(square.text()).toEqual('X')
        })

        //TODO Still working how to test context injection
        // it("should have an onclick calls the onClickSquare in the domain", () => {
        //     const domain: GameDomain = {loadJson: jest.fn(), onClickSquare: jest.fn()}
        //     let context = lensContext(gameJson, jest.fn(), 'game')
        //
        //     jest.spyOn(Square, 'useContext')
        //
        //     const square = render(<Square context={squareContext(context, 1)}/>)
        //     square.simulate('click')
        //
        //     expect(loadJson.mock.calls.length).toBe(1)
        //     let data: GameData = loadJson.mock.calls[0][0]
        //     expect(data.state).toBe('O') // inverted
        //     expect(data._embedded.board.squares[1]).toBe('X')
        // })
    })
})
