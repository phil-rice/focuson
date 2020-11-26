import {Files, PathAndSha} from "./Files";
import {StringReplaceData, Strings} from "./Strings";
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
        let name = pathAndSha.path.name;
        return ({fromMatcher: new RegExp(`#${name}/render#`, 'gi'), to: `created/${name}/${pathAndSha.sha}`})
    }
    toFileName(sourceAndTargetDir: JsonSourceDirAndTargetDir, fileName: string): string {return path.join(sourceAndTargetDir.targetDir, fileName)}

    processOneJsonFile(sourceAndTargetDir: JsonSourceDirAndTargetDir, stringReplaceData: StringReplaceData[]): (file: string) => Promise<void> {
        return file => this.files.copyAndChangeFile(
            path.parse(file),
            Strings.replaceMultipleStrings(stringReplaceData),
            this.toFileName(sourceAndTargetDir, file))
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
            this.files.validateDirectoryExists("Target Directory", sourceAndTargetDir.targetDir)])
    }
}
