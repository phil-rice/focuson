import {BabelFileResult} from "@babel/core";
import {ParsedPath} from "path";
import {Files, PathAndSha} from "./Files";

const path = require('path');
const babel = require("@babel/core");
export interface SourceAndTargetDir {
    sourceDir: string,
    targetDir: string
}

export class TsxTransformer {

    files: Files

    constructor(files: Files) { this.files = files;}

    transformTheCodeAfterBabel(fileNameNoExt: string, result: { code: string }) {
        const babelCode = result.code.replace('"use strict";', '').trim();
        const appendStr = `return ${fileNameNoExt};`;
        const transformedContents = `${babelCode}
        ${appendStr}`;
        return transformedContents
    }

    remoteImportStatementsAndBlankNewLines = (contents: string) =>
        contents.replace(/^import.*$/gm, '').replace(/^\s*[\r\n]/gm, '');

    checkResult(file: string, result: BabelFileResult | null): string {
        if (result == null) throw new Error(`Could not compile ${file}` + result)
        return result.code
    }

    transformCode(contents: string): Promise<string> {
        return babel.transformAsync(this.remoteImportStatementsAndBlankNewLines(contents)).then(this.transformTheCodeAfterBabel).then(this.checkResult)
    }

    toFileName = (sourceAndTargetDir: SourceAndTargetDir) => (parsedPath: ParsedPath, sha: string): ParsedPath =>
        path.parse(path.path.join(sourceAndTargetDir.targetDir, parsedPath.base))

    loadAndTransformOneFile(sourceAndTargetDir: SourceAndTargetDir): (file: string) => Promise<PathAndSha> {
        return file => {
            let parsedPath = path.parse(file)
            return this.files.copyTransformAndSaveFileForContentAddressableData(
                parsedPath,
                this.transformCode,
                this.toFileName(sourceAndTargetDir))
        }
    }

    loadAndtransformAllFiles(sourceAndTargetDir: SourceAndTargetDir): Promise<PathAndSha[]> {
        this.validate(sourceAndTargetDir);
        return this.files.forEachFile<PathAndSha>(sourceAndTargetDir.sourceDir)(this.loadAndTransformOneFile(sourceAndTargetDir))
    }
    validate(sourceAndTargetDir: SourceAndTargetDir): Promise<void[]> {
        return Promise.all([
            this.files.validateDirectoryExists("Source Directory", sourceAndTargetDir.sourceDir),
            this.files.validateDirectoryExists("Target Directory", sourceAndTargetDir.targetDir)])
    }
}
