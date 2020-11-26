import {ParsedPath} from "path";
import {Strings} from "./Strings";

const fs = require('fs');

export interface PathAndSha {
    path: ParsedPath,
    sha: string
}


export class Files {
    forEachFile<Res>(dir: string): (fn: (file: string) => Promise<Res>) => Promise<Res[]> {
        return fn => Promise.all(fs.readdir(dir).then(files => files.map(fn)))
    }

    validateDirectoryExists(message: string, dir: string): Promise<void> {
        return fs.lstat(dir).then(stats => { if (!stats.isDirectory()) throw new Error(`${message}: ${dir}`) })
    }

    createDirectoryForFile(parsedPath: ParsedPath): Promise<void> { return fs.mkdir(parsedPath.dir, {recursive: true}) }

    saveFileIfDoesntExist(parsedPath: ParsedPath, content: string): Promise<void> {
        this.createDirectoryForFile(parsedPath)
        return fs.stat(parsedPath).then(stat => {
                console.log(`filename exists`);
            }, err => {
                if (err.code === 'ENOENT') {
                    // file does not exist. Create sha files and write updated content to it
                    fs.writeFile(parsedPath, content, 'utf-8').//
                        then(() => {
                            console.log(`${parsedPath} created`)
                        });
                } else {
                    console.log('Error saving file: ', err.code);
                    throw err
                }
            }
        );
    }

    copyAndChangeFile(fromFileName: ParsedPath, transformer: (raw: string) => string, toFileName: string): Promise<void> {
        return fs.readFile(fromFileName, 'utf-8').then(transformer).then(content => fs.writeFile(toFileName, content, 'utf-8'))
    }

    copyTransformAndSaveFileForContentAddressableData(fromPath: ParsedPath,
                                                      transformer: (raw: string) => Promise<string>,
                                                      toFileNameFn: (parsePath: ParsedPath, sha: string) => ParsedPath): Promise<PathAndSha> {
        return fs.readFile(fromPath, 'utf-8').//
            then(transformer).//
            then(Strings.findSha).//
            then(contentAndSha => {
                let parsedPath = toFileNameFn(fromPath, contentAndSha.sha);
                return this.saveFileIfDoesntExist(parsedPath, contentAndSha.content).//
                    then(() => ({parsedPath: parsedPath, sha: contentAndSha.sha}))
            })
    }
}

