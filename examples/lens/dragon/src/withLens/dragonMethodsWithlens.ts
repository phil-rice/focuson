//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS

import {Lens} from "@phil-rice/lens";
import {Dragon, Hitpoint} from "../../index";

export let dragonL = Lens.build<Dragon>('dragon');
export let dragonBodyL = dragonL.focusOn('body');


export let dragonHeadHpL: Lens<Dragon, Hitpoint> = dragonL.focusOn('head').focusOn('hitpoints')
export let dragonChestHpL: Lens<Dragon, Hitpoint> = dragonBodyL.focusOn('chest').focusOn('hitpoints')
export let dragonLeftWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.focusOn('leftWing').focusOn('hitpoints')
export let dragonRightWingHpL: Lens<Dragon, Hitpoint> = dragonBodyL.focusOn('rightWing').focusOn('hitpoints')



export let dragonContentsL: Lens<Dragon, any[]> = dragonL.focusOn('body').focusOn('chest').focusOn('stomach').focusOn('contents')

export function eat(item: any): (d: Dragon) => Dragon {
    return dragonContentsL.transform(oldContents => [...oldContents, item]);}



export function damage(locationHpL: Lens<Dragon, Hitpoint>, damage: Hitpoint): (d: Dragon) => Dragon {
    return locationHpL.transform(hp => damage > hp ? 0 : hp - damage)
}
export function heal(locationHpL: Lens<Dragon, Hitpoint>, maxHp: Hitpoint, amount: Hitpoint): (d: Dragon) => Dragon {
    return locationHpL.transform(hp =>  (hp + amount)>maxHp ? maxHp : hp + amount)
}




