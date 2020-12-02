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
        const sha256Code = shajs('sha256').update(content).digest('hex');
        return ({ content: content, sha: sha256Code })
    }
    static getExtension(file: string) {
        const [fileNameNoExt, ...fileProps] = file.split('.');
        return fileNameNoExt;
    }
    static replaceMultipleStrings(stringReplaceData: StringReplaceData[]): (contents: string) => string {
        return contents => stringReplaceData.reduce((acc, v) => acc.replace(v.fromMatcher, v.to), contents)
    }
}
