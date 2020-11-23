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

let dragon: Dragon = {body: {chest: {stomach: {contents: ['the adventurer']}}}, head: {eyeCount: 1}}
interface Dragon {
    body: Body,
    head: Head
}
interface Body {chest: Chest}
interface Head {eyeCount: number}
interface Chest {stomach: Stomach}
interface Stomach {contents: any[]}


function eat(dragon: Dragon, item: any): Dragon {
    return {
        ...dragon,
        body: {
            ...dragon.body,
            chest: {
                ...dragon.body.chest,
                stomach: {
                    ...dragon.body.chest.stomach,
                    contents: [...dragon.body.chest.stomach.contents, item]
                }
            }
        }
    }
}

let dragonToStomachContentsL = Lens.build<Dragon>('dragon').then('body').then('chest').then('stomach').then('contents')
function eat2(dragon: Dragon, item: any) {return dragonToStomachContentsL.transformInSitu(dragon, old => [...old, item])}
