//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import { SHA256 } from 'crypto-js';

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
