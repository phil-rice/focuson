import {LensContext} from "./LensContext";
import {Lens} from "./Lens";
import {a1b2ca3, Chest, dragon, Dragon, dragon2, DragonDomain, letnstoca, list123, Stomach} from "./LensFixture";


let initialMain = {...dragon}
let domain = new DragonDomain()
let setMain = jest.fn();
let dragonC = LensContext.main(domain, dragon, setMain, "dragon")
let chestC = dragonC.focusOn('body').focusOn('chest')
let stomachC = chestC.focusOn('stomach')

function setupForSetMain<Domain, Main, T>(context: LensContext<Domain, Main, T>, fn: (context: LensContext<Domain, Main, T>, setMain: jest.Mock) => void) {
    const setMain = jest.fn()
    let newContext = context.withSetMain(setMain)
    fn(newContext, setMain)
}

function checkSetMainWas<Main>(setMain: jest.Mock, expected: Main) {
    expect(setMain.mock.calls.length).toEqual(1)
    expect(setMain.mock.calls[0][0]).toEqual(expected)
    expect(dragon).toEqual(initialMain) //just checking no sideeffects
}

function checkContext<T>(context: LensContext<DragonDomain, Dragon, T>, lensDescription: string) {
    expect(context.domain).toEqual(domain)
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
        let replace = chestC.withLens(chestC.lens.withDescription('theNewLens'))
        checkContext(replace, 'theNewLens')
    })
    it("with withChildLens should concatenate with the parent lens", () => {
        let child = chestC.withChildLens(Lens.identity<Chest>().withDescription('childName'))
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