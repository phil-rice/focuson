//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {dragon, Dragon, Head, Hitpoint} from "../../index";
import {Lens, Lenses} from "@focuson/lens";

let dragonL = Lenses.build<Dragon>('dragon');
let dragonBodyL = dragonL.focusOn('body');
let dragonContentsL: Lens<Dragon, any[]> = dragonBodyL.focusOn('chest').focusOn('stomach').focusOn('contents')
let dragonLeftWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.focusOn('leftWing').focusOn('hitpoints')
let dragonRightWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.focusOn('rightWing').focusOn('hitpoints')
let dragonHeadHpL: Lens<Dragon, Hitpoint> = dragonL.focusOn('head').focusOn('hitpoints')
let dragonHChestHpL: Lens<Dragon, Hitpoint> = dragonBodyL.focusOn('chest').focusOn('hitpoints')


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

let personL = Lenses.build<Person>('person')
let personChestHpL = personL.focusOn('chest').focusOn('hitpoints')
let personHeadHpL = personL.focusOn('head').focusOn('hitpoints')



