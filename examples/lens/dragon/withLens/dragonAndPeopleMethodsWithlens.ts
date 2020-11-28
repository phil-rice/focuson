import {dragon, Dragon, Head, Hitpoint} from "../dragon";
import {Lens} from "@phil-rice/lens";

let dragonL = Lens.build<Dragon>('dragon');
let dragonBodyL = dragonL.then('body');
let dragonContentsL: Lens<Dragon, any[]> = dragonBodyL.then('chest').then('stomach').then('contents')
let dragonLeftWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('leftWing').then('hitpoints')
let dragonRightWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('rightWing').then('hitpoints')
let dragonHeadHpL: Lens<Dragon, Hitpoint> = dragonL.then('head').then('hitpoints')
let dragonHChestHpL: Lens<Dragon, Hitpoint> = dragonBodyL.then('chest').then('hitpoints')


export function eat<Main>(mainToStomachLens: Lens<Main, any[]>, item: any): (d: Main) => Main {return mainToStomachLens.transform(oldContents => [...oldContents, item]);}
export function damage<Main>(locationHpL: Lens<Main, Hitpoint>, damage: Hitpoint): (d: Main) => Main {
    return locationHpL.transform(hp => damage > hp ? 0 : hp - damage)
}
export function heal<Main>(locationHpL: Lens<Dragon, Hitpoint>, maxHp: Hitpoint, amount: Hitpoint): (d: Dragon) => Dragon {
    return locationHpL.transform(hp => maxHp > (hp + amount) ? maxHp : hp + amount)
}


interface Person {
    head: Head,
    chest: PersonChest
}
interface PersonChest {hitpoints: Hitpoint}

let personL = Lens.build<Person>('person')
let personChestHpL = personL.then('chest').then('hitpoints')
let personHeadHpL = personL.then('head').then('hitpoints')



