import {dragon, Dragon, Hitpoint} from "../dragon";
import {Lens} from "../../../index";

export let dragonL = Lens.build<Dragon>('dragon');
export let dragonBodyL = dragonL.then('body');
export let dragonContentsL: Lens<Dragon, any[]> = dragonBodyL.then('chest').then('stomach').then('contents')
export let dragonHeadHpL: Lens<Dragon, Hitpoint> = dragonL.then('head').then('hitpoints')
export let dragonChestHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('chest').then('hitpoints')
export let dragonLeftWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('leftWing').then('hitpoints')
export let dragonRightWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('rightWing').then('hitpoints')

export function eat(item: any): (d: Dragon) => Dragon {return dragonContentsL.transform(oldContents => [...oldContents, item]);}
export function damage(locationHpL: Lens<Dragon, Hitpoint>, damage: Hitpoint): (d: Dragon) => Dragon {
    return locationHpL.transform(hp => damage > hp ? 0 : hp - damage)
}
export function heal(locationHpL: Lens<Dragon, Hitpoint>, maxHp: Hitpoint, amount: Hitpoint): (d: Dragon) => Dragon {
    return locationHpL.transform(hp =>  (hp + amount)>maxHp ? maxHp : hp + amount)
}

//example calls

eat('anotherAdventurer')(dragon)
damage(dragonLeftWingHpL, 3)(dragon)
damage(dragonRightWingHpL, 3)(dragon)
damage(dragonHeadHpL, 3)(dragon)

heal(dragonLeftWingHpL, 10, 3)(dragon)
heal(dragonRightWingHpL, 10, 3)(dragon)
heal(dragonHeadHpL, 10, 3)(dragon)


