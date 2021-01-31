//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import { Files, PathAndSha } from "./Files";
import { StringReplaceData, Strings } from "./Strings";
import * as fs from "fs";

const path = require('path');

export interface JsonSourceDirAndTargetDir {
    jsonSourceDir: string,
    targetDir: string
}

export class JsonTransformer {
    files: Files

    constructor(files: Files) { this.files = files; }

    makeStringReplaceData(pathAndSha: PathAndSha): StringReplaceData {
        let name = pathAndSha.parsedPath.name;
        return ({ fromMatcher: new RegExp(`#${name}/render#`, 'gi'), to: `created/${name}/${pathAndSha.sha}` })
    }
    toFileName(sourceAndTargetDir: JsonSourceDirAndTargetDir, fileName: string): string { return path.join(sourceAndTargetDir.targetDir, fileName) }

    processOneJsonFile(sourceAndTargetDir: JsonSourceDirAndTargetDir, stringReplaceData: StringReplaceData[]): (file: string) => Promise<void> {
        return file => {
            let parsedPath = path.parse(path.join(sourceAndTargetDir.jsonSourceDir, file));
            return this.files.copyAndChangeFile(
                parsedPath,
                Strings.replaceMultipleStrings(stringReplaceData),
                this.toFileName(sourceAndTargetDir, file))
        }
    }

    updateJsonFiles(sourceAndTargetDir: JsonSourceDirAndTargetDir): (pathAndShas: PathAndSha[]) => Promise<void[]> {
        this.validate(sourceAndTargetDir);
        return pathAndShas => {
            let stringReplaceData = pathAndShas.map(this.makeStringReplaceData)
            return this.files.forEachFile<void>(sourceAndTargetDir.jsonSourceDir)(this.processOneJsonFile(sourceAndTargetDir, stringReplaceData))
        }
    }

    validate(sourceAndTargetDir: JsonSourceDirAndTargetDir): Promise<void[]> {
        return Promise.all([
            this.files.validateDirectoryExists("Json Source Directory", sourceAndTargetDir.jsonSourceDir),
            this.files.validateDirectoryExists("Target Directory", sourceAndTargetDir.targetDir)
        ])
    }
}
