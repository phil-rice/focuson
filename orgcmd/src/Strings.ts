import { SHA256 } from 'crypto-js';
const shajs = require('sha.js');

export interface StringReplaceData {
    fromMatcher: RegExp,
    to: string
}

export interface ContentAndSha {
    content: string,
    sha: string
}

export class Strings {
    static findSha(content: string): ContentAndSha {
        const sha256Code = SHA256(content).toString();
        return ({ content: content, sha: sha256Code })
    }

    static replaceMultipleStrings(stringReplaceData: StringReplaceData[]): (contents: string) => string {
        return contents => stringReplaceData.reduce((acc, v) => acc.replace(v.fromMatcher, v.to), contents)
    }
}
