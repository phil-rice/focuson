//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS

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

export function getElement(name: string): HTMLElement {
    let result = document.getElementById(name);
    if (result === null) throw Error(`Must have an element called ${name}, and can't find it`)
    return result
}