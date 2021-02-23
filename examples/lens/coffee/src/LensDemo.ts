//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS

import {Lens, Lenses} from "@focuson/lens";
export interface Msg {order: Order}
interface Order {
    cup: Cup,
    milk: Milk,
    shots: number
}
type Cupsize = "small" | "medium" | "large"
type CupMadeOf = "styrofoam" | "porcelain"
interface Cup {
    size: Cupsize,
    madeOf: CupMadeOf
}
type MilkType = "full-fat" | "skimmed" | "almond" | "semi" | "soy"
type MilkAmount = "splash" | "loads"
interface Milk {
    type: MilkType,
    amount: MilkAmount
}

let json: Msg = {
    order: {
        cup: {
            size: "small",       // medium large
            madeOf: "styrofoam"  // or you could be eating in and it be a proper cup
        },
        milk: {
            type: "almond",
            amount: "splash"
        },
        shots: 1
    }
}


function getCupSize(json: Msg) {return json.order.cup.size}
function setCupSize(json: Msg, size: Cupsize): Msg {
    return ({
        ...json,
        order: {
            ...json.order,
            cup: {
                ...json.order.cup, size
            }
        }
    })
}
function getCupMadeOf(json: Msg) {return json.order.cup.madeOf}
function setCupMadeOf(json: Msg, madeOf: CupMadeOf): Msg {
    return ({
        ...json,
        order: {
            ...json.order,
            cup: {
                ...json.order.cup, madeOf
            }
        }
    })
}

//What if we decide to get rid of the order
//who much code is impacted


let msgToCupsizeLens = Lenses.build<Msg>('msg').focusOn('order').focusOn('cup').focusOn('size')
let getCupSize2 = msgToCupsizeLens.get
let setCupSize2 = msgToCupsizeLens.set
let msgToMadeOfLens = Lenses.build<Msg>('msg').focusOn('order').focusOn('cup').focusOn('madeOf')
let setCupMadeOf2 = msgToMadeOfLens.set

console.log(msgToCupsizeLens.get(json))

msgToCupsizeLens.set(json, "medium")

function changeAndSend<T>(json: Msg, lens: Lens<Msg, T>, t: T) {
    let newJson = lens.set(json, t)
}
