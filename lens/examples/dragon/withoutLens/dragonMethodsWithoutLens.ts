import {dragon, Dragon, Hitpoint} from "../dragon";


export function eat(dragon: Dragon, item: any): Dragon {
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
type Location = 'head' | 'chest' | 'leftwing' | 'rightwing'
export function damage(dragon: Dragon, location: Location, amount: Hitpoint) {
    switch (location) {
        case 'head':
            return damageHead(dragon, amount)
        case 'chest':
            return damageChest(dragon, amount)
        case 'leftwing':
            return damageLeftWing(dragon, amount)
        case 'rightwing':
            return damageRightWing(dragon, amount)
    }
}
function maxZero(hp: Hitpoint) {return hp > 0 ? hp : 0}
function damageHead(dragon: Dragon, amount: Hitpoint) {
    return {
        ...dragon,
        head: {
            ...dragon.head,
            hitpoints: maxZero(
                dragon.head.hitpoints - amount)
        }
    }
}
function damageChest(dragon: Dragon, amount: Hitpoint) {
    return {
        ...dragon,
        body: {
            ...dragon.body,
            chest: {
                ...dragon.body.chest,
                hitpoints: maxZero(dragon.body.chest.hitpoints - amount)
            }
        }
    }
}
function damageLeftWing(dragon: Dragon, amount: Hitpoint) {
    return {
        ...dragon,
        body: {
            ...dragon.body,
            leftWing: {
                hitpoints: maxZero(dragon.body.leftWing.hitpoints - amount)
            }
        }
    }
}
function damageRightWing(dragon: Dragon, amount: Hitpoint) {
    return {
        ...dragon,
        body: {
            ...dragon.body, rightWing: {
                hitpoints: maxZero(dragon.body.rightWing.hitpoints - amount)
            }
        }
    }
}

export function heal(dragon: Dragon, location: string, maxHp: Hitpoint, amount: Hitpoint) {
    switch (location) {
        case 'head':
            return healHead(dragon, maxHp, amount)
        case 'chest':
            return healChest(dragon, maxHp, amount)
        case 'leftwing':
            return healLeftWing(dragon, maxHp, amount)
        case 'rightwing':
            return healRightWing(dragon, maxHp, amount)
    }
}
function healAndCap(maxHp: Hitpoint, hp: Hitpoint, amount: Hitpoint) {return hp + amount > maxHp ? maxHp : hp + amount}

function healHead(dragon: Dragon, maxHp: Hitpoint, amount: Hitpoint) {
    return {
        ...dragon,
        head: {
            ...dragon.head, hitpoints: healAndCap(maxHp, amount, dragon.head.hitpoints)
        }
    }
}
function healChest(dragon: Dragon, maxHp: Hitpoint, amount: Hitpoint) {
    return {
        ...dragon,
        body: {
            ...dragon.body,
            chest: {
                ...dragon.body.chest,
                hitpoints: healAndCap(maxHp, amount, dragon.body.chest.hitpoints)
            }
        }
    }
}
function healLeftWing(dragon: Dragon, maxHp: Hitpoint, amount: Hitpoint) {
    return {
        ...dragon,
        body: {
            ...dragon.body,
            leftWing: {hitpoints: healAndCap(maxHp, amount, dragon.body.leftWing.hitpoints)}
        }
    }
}
function healRightWing(dragon: Dragon, maxHp: Hitpoint, amount: Hitpoint) {
    return {
        ...dragon,
        body: {
            ...dragon.body,
            rightWing: {hitpoints: healAndCap(maxHp, amount, dragon.body.rightWing.hitpoints)}
        }
    }
}

//example

eat(dragon, 'anotherAdventurer')
damage(dragon, 'leftwing', 3)
damage(dragon, 'rightwing', 3)
damage(dragon, 'chest', 3)
damage(dragon, 'head', 3)

heal(dragon, 'leftwing', 10, 3)
heal(dragon, 'rightwing', 10, 3)
heal(dragon, 'chest', 10, 3)
heal(dragon, 'head', 10, 3)
