import {digestorChecker} from "./LoadAndCompileCache";
import {lens, Lens} from "./utils";
import exp from "constants";

let a1b2ca3 = {a: 1, b: 2, c: {a: 3}}
let list123 = [1, 2, 3]
let lensToc = lens<any, any>(f => f.c, (m, c) => ({...m, c}))
let lenscToa = lens<any, any>(f => f.a, (m, a) => ({...m, a}))
let letnstoca = lensToc.andThen(lenscToa)

describe("Lens", () => {
    describe("identity", () => {
        let lens: Lens<any, any> = Lens.identity()
        it("should return the same", () => {
            expect(lens.get(a1b2ca3)).toBe(a1b2ca3)
        })
        it("should create the new value", () => {
            expect(lens.set(a1b2ca3, "newValue")).toBe("newValue")
        })
    })
    describe("nth", () => {
        it("should allow access to nth item", () => {
            expect(Lens.nth(0).get(list123)).toBe(1)
            expect(Lens.nth(1).get(list123)).toBe(2)
            expect(Lens.nth(2).get(list123)).toBe(3)
        })

        it("should set the nth item", () => {
            expect(Lens.nth(0).set(list123, 4)).toEqual([4, 2, 3])
            expect(Lens.nth(1).set(list123, 4)).toEqual([1, 4, 3])
            expect(Lens.nth(2).set(list123, 4)).toEqual([1, 2, 4])
        })
    })
    describe("lens composition", () => {
        expect(letnstoca.get(a1b2ca3)).toEqual(3)
        expect(letnstoca.set(a1b2ca3, 9)).toEqual({a: 1, b: 2, c: {a: 9}})
    })
})