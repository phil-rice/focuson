import {isFunction} from "util";


export function fromObject<M, K extends keyof M>(map: M, key: K): M[K] {
    let value = map[key]
    if (value === undefined) throw Error('fromMap is null for name ' + key)
    return value
}
export function fromMap<K, V>(map: Map<K, V>, k: K): V {
    if (!map) throw Error('map is undefined')
    let result = map.get(k)
    if (result !== undefined) return result
    throw Error(`Cannot find data for ${k}\nLegal values are ${Array.from(map.keys()).sort()}`)
}
export function checkIsFunction(functionToCheck: any) {
    if (!isFunction(functionToCheck)) throw Error('getter should be a function, instead is ' + JSON.stringify(functionToCheck))
}
export function identity<T>(t: T): T {return t}
export interface Tuple<T1, T2> {
    one: T1,
    two: T2
}

export function getElement(name: string): HTMLElement {
    let result = document.getElementById(name);
    if (result === null) throw Error(`Must have an element called ${name}, and can't find it`)
    return result
}