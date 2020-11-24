import {dragon, Dragon, Hitpoint} from "../dragon";
import {Lens} from "../../../index";
import {damage, dragonChestHpL, dragonContentsL, dragonHeadHpL, dragonLeftWingHpL, dragonRightWingHpL, eat, heal} from "./dragonMethodsWithlens";


export let startDragon: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 4}
    },
    head: {hitpoints: 3, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}


describe("Dragon with lens", () => {
    it("should have lens to hitpoints", () => {
        expect(dragonHeadHpL.get(startDragon)).toEqual(3)
        expect(dragonChestHpL.get(startDragon)).toEqual(10)
        expect(dragonLeftWingHpL.get(startDragon)).toEqual(5)
        expect(dragonRightWingHpL.get(startDragon)).toEqual(4)
    })

    it("should have an eat method", () => {
        expect(eat('somethingtasty')(startDragon)).toEqual(dragonContentsL.set(startDragon, ['the adventurer', 'somethingtasty']))
    })
    it("should have an heal method", () => {
        expect(heal(dragonHeadHpL, 20, 3)(startDragon)).toEqual(dragonHeadHpL.set(startDragon, 6))
        expect(heal(dragonHeadHpL, 5, 3)(startDragon)).toEqual(dragonHeadHpL.set(startDragon, 5))
    })
    it("should have an damage method", () => {
        expect(damage(dragonHeadHpL, 2)(startDragon)).toEqual(dragonHeadHpL.set(startDragon, 1))
        expect(damage(dragonHeadHpL, 20)(startDragon)).toEqual(dragonHeadHpL.set(startDragon, 0))
    })
})