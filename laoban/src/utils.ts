import {Writable} from "stream";

export function flatten<T>(list: T[][]): T[]{
    return [].concat(...list)
}
export class Strings {
    static maxLength = (ss: string[]) => Math.max(...(ss.map(s => s.length)));
    static indentEachLine(indent: string, lines: string): string {
        return lines.split('\n').map(s => indent + s).join('\n')
    }
}
export function chain<From, To>(decorators: ((fn: (f: From) => To) => ((f: From) => To))[]): ((fn: (f: From) => To) => ((f: From) => To)) {
    return raw => decorators.reduce((acc, v) => v(acc), raw)
}

export function writeTo(ws: Writable[], data: any) {
    ws.forEach(s => s.write(data))
}

export interface StringAndWidth {
    value: string,
    width: number
}

export var partition = function (arr, length) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (i % length === 0) result.push([]);
        result[result.length - 1].push(arr[i]);
    }
    return result;
};
export class Maps {
    static add<K, V>(map: Map<K, V[]>, k: K, v: V) {
        let existing = map.get(k)
        if (existing) {
            existing.push(v)
        } else {
            map.set(k, [v])
        }
    }
    static addAll<K, V>(map: Map<K, V[]>, k: K, vs: V[]) {
        let existing = map.get(k)
        if (existing) {
            vs.forEach(v => existing.push(v))
        } else {
            map.set(k, [...vs])
        }
    }
}