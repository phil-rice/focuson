//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Lenses} from "@focuson/lens";
import {LensState, lensState} from "@focuson/state";
import {Chest, Dragon, dragon} from "./LensFixture";


let initialMain = {...dragon}
let setMain = jest.fn();
let dragonC = lensState( dragon, setMain, "dragon")
let chestC = dragonC.focusOn('body').focusOn('chest')
let stomachC = chestC.focusOn('stomach')

function setupForSetMain< Main, T>(context: LensState< Main, T>, fn: (context: LensState< Main, T>, setMain: jest.Mock) => void) {
    const setMain = jest.fn()
    let newContext: LensState<Main, T> =new LensState(context.main, setMain, context.lens)
    fn(newContext, setMain)
}

function checkSetMainWas<Main>(setMain: jest.Mock, expected: Main) {
    expect(setMain.mock.calls.length).toEqual(1)
    expect(setMain.mock.calls[0][0]).toEqual(expected)
    expect(dragon).toEqual(initialMain) //just checking no sideeffects
}

function checkContext<T>(context: LensState< Dragon, T>, lensDescription: string) {
    expect(context.main).toEqual(dragon)
    expect(context.lens.description).toEqual(lensDescription)
    expect(context.dangerouslySetMain).toEqual(setMain)
}
describe("LensContext", () => {
    it("create", () => {
        checkContext(dragonC, 'dragon')
        checkContext(chestC, 'dragon/body/chest')
    })
    it("should have json equal to the focus of the  lens", () => {
        expect(dragonC.json()).toEqual(dragon)
        expect(chestC.json()).toEqual(dragon.body.chest)
    })

    it("with Lens should ignore the parent lens", () => {
        let replace = chestC.copyWithLens(chestC.lens.withDescription('theNewLens'))
        checkContext(replace, 'theNewLens')
    })
    it("with withChildLens should concatenate with the parent lens", () => {
        let child = chestC.chainLens(Lenses.identity<Chest>().withDescription('childName'))
        checkContext(child, 'dragon/body/chest/childName')
    })
    it("setJson should call danagerouslySetMain with the result of passing main and the new json to the lens", () => {
        let json = {stomach: {contents: [1, 2, 3]}};
        setupForSetMain(stomachC, (context, setMain) => {
            context.setJson(json)
            checkSetMainWas(setMain, stomachC.lens.set(dragon, json))
        })
    })

    // it("setFrom should call dangerousSetMain using the lens concatenated to the current state", () => {
    //     let json = {stomach: {contents: [1, 2, 3]}};
    //     setupForSetMain(stomachC, (context, setMain) => {
    //         let newLens = Lens.build<Dragon>('passedLens')
    //         context.setFrom(newLens, json)
    //         checkSetMainWas(setMain, context.lens.andThen(square3L).set(SimpleGameDomain.emptyGame, 'X'))
    //     })
    // })

})