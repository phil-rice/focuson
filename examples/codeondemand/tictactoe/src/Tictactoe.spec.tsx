import React from 'react';

import {enzymeSetup} from './enzymeAdapterSetup';
import {shallow, ShallowWrapper} from "enzyme";

import {Lens, LensContext} from "@phil-rice/lens";
import {BoardData, defaultStateLens, GameData, GameDomain} from "./GameDomain";
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

let cache: any = ''//this isn't used and it's ok if it throws errors as that will indicate test failuer
let domain = new GameDomain(cache, defaultStateLens, () => Promise.resolve())
let context = LensContext.main <GameDomain<GameData>, GameData>(domain, gameJson, setJson, 'game')
function squareContext(context: LensContext<GameDomain<GameData>, GameData, GameData>, n: number) {
    return context.focusOn('_embedded').focusOn('board').focusOn('squares').withChildLens(Lens.nth(n))
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
        it("should have an onclick that inverts the state, and sets the square with the current state", () => {
            let setJson = jest.fn()
            let context = LensContext.main <GameDomain<GameData>, GameData>(domain, gameJson, setJson, 'game')
            const square = shallow(<Square context={squareContext(context, 1)}/>)
            square.simulate('click')
            expect(setJson.mock.calls.length).toBe(1)
            let data: GameData = setJson.mock.calls[0][0]
            expect(data.state).toBe('O') // inverted
            expect(data._embedded.board.squares[1]).toBe('X')
        })
    })
})
