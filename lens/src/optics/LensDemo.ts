import {Lens} from "./Lens";


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




let msgToCupsizeLens = Lens.build<Msg>('msg').then('order').then('cup').then('size')
let getCupSize2= msgToCupsizeLens.get
let setCupSize2= msgToCupsizeLens.get
let msgToMadeOfLens = Lens.build<Msg>('msg').then('order').then('cup').then('madeOf')
let setCupMadeOf2 = msgToMadeOfLens.set

console.log(msgToCupsizeLens.get(json))

msgToCupsizeLens.set(json, "medium")

function changeAndSend<T>(json: Msg, lens: Lens<Msg, T>, t: T) {
    let newJson = lens.set(json, t)
}
