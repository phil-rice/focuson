//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import { Stats } from "fs";
import path, { parse, ParsedPath } from "path";
import { Strings } from "./Strings";
import { TsxTransformer } from "./TsxTransformer";

const fs = require('fs');

export interface PathAndSha {
    parsedPath: ParsedPath,
    sha: string
}

export interface ContentAndSha {
    content: string,
    sha: string
}

export interface SourceAndTargetDir {
    sourceDir: string,
    targetDir: string
}

export class Files {
    forEachFile<Res>(dir: string): (fn: (file: string) => Promise<Res>) => Promise<Res[]> {
        return fn => fs.promises.readdir(dir).then((files: string[]) => Promise.all(files.map(fn)))
    }

    validateDirectoryExists(message: string, dir: string): Promise<void> {
        return fs.promises.lstat(dir).then((stat: Stats) => {
        }, (err: { code: string, message: string }) => {
            if (err.code === 'ENOENT') {
                throw new Error(`Error: ${message}: ${dir} not found.`);
            } else {
                throw new Error(`Error: ${message}: ${dir}: ${err.message}`)
            }
        }
        );
    }

    createDirectoryForFile(parsedPath: ParsedPath): Promise<void> {
        return fs.promises.mkdir(parsedPath.dir, { recursive: true })
    }

    saveFileIfDoesntExist(parsedPath: ParsedPath, content: string, sha: string): Promise<void> {
        const newPath = path.join(parsedPath.dir, parsedPath.name, sha);
        const newParsedPath = path.parse(newPath);
        this.createDirectoryForFile(newParsedPath);
        return fs.promises.stat(newPath).then((stat: Stats) => {
        }, (err: { code: string }) => {
            if (err.code === 'ENOENT') {
                // file does not exist. Create sha files and write updated content to it
                fs.promises.writeFile(newPath, content, 'utf-8').//
                    then(() => {
                        console.log(`${newParsedPath.base} created`)
                    });
            } else {
                console.log('Error saving file: ', err.code);
                throw err
            }
        }
        );
    }

    copyAndChangeFile(fromFileName: ParsedPath, transformer: (raw: string) => string, toFileName: string): Promise<void> {
        return fs.promises.readFile(path.join(fromFileName.dir, fromFileName.base), 'utf-8').then(transformer).then((content: string) => fs.promises.writeFile(toFileName, content, 'utf-8'))
    }

    copyTransformAndSaveFileForContentAddressableData(
        fromPath: ParsedPath,
        transformer: (content: string, file: string) => Promise<string>,
        toFileNameFn: (parsedPath: ParsedPath, sha: string) => ParsedPath): Promise<PathAndSha> {
        return fs.promises.readFile(path.join(fromPath.dir, fromPath.base), 'utf-8')
            .then((content: string) =>
                transformer.call(new TsxTransformer(this), content, fromPath.base)
            )
            .then(Strings.findSha)
            .then((contentAndSha: ContentAndSha) => {
                let parsedPath = toFileNameFn(fromPath, contentAndSha.sha);
                return this.saveFileIfDoesntExist(parsedPath, contentAndSha.content, contentAndSha.sha).//
                    then(() => ({ parsedPath: parsedPath, sha: contentAndSha.sha }))
            })
    }
}

