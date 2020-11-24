import {dragon, Dragon, Hitpoint} from "../dragon";
import {Lens} from "../../../index";

export let dragonL = Lens.build<Dragon>('dragon');
export let dragonBodyL = dragonL.then('body');


export let dragonHeadHpL: Lens<Dragon, Hitpoint> = dragonL.then('head').then('hitpoints')
export let dragonChestHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('chest').then('hitpoints')
export let dragonLeftWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('leftWing').then('hitpoints')
export let dragonRightWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('rightWing').then('hitpoints')



export let dragonContentsL: Lens<Dragon, any[]> = dragonBodyL.then('chest').then('stomach').then('contents')

export function eat(item: any): (d: Dragon) => Dragon {
    return dragonContentsL.transform(oldContents => [...oldContents, item]);}
1


export function damage(locationHpL: Lens<Dragon, Hitpoint>, damage: Hitpoint): (d: Dragon) => Dragon {
    return locationHpL.transform(hp => damage > hp ? 0 : hp - damage)
}
export function heal(locationHpL: Lens<Dragon, Hitpoint>, maxHp: Hitpoint, amount: Hitpoint): (d: Dragon) => Dragon {
    return locationHpL.transform(hp =>  (hp + amount)>maxHp ? maxHp : hp + amount)
}




