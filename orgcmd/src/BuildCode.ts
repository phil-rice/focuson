#!/usr/bin/env node

import { SourceAndTargetDir, TsxTransformer } from "./TsxTransformer";
import { JsonSourceDirAndTargetDir, JsonTransformer } from "./JsonTransformer";
import { Files, PathAndSha } from "./Files";

interface SourceJsonSourceAndTargetDir extends SourceAndTargetDir, JsonSourceDirAndTargetDir { }

export class BuildCode {
    tsxTransformer: TsxTransformer
    jsonTransformer: JsonTransformer

    static create(): BuildCode {
        let files = new Files()
        return new BuildCode(new TsxTransformer(files), new JsonTransformer(files))
    }

    constructor(tsxTransformer: TsxTransformer, jsonTransformer: JsonTransformer) {
        this.tsxTransformer = tsxTransformer;
        this.jsonTransformer = jsonTransformer;
    }

    validate(src: SourceJsonSourceAndTargetDir, skipJson: boolean) {
        return (skipJson) ? Promise.all([this.tsxTransformer.validate(src)]) : Promise.all([this.tsxTransformer.validate(src), this.jsonTransformer.validate(src)]);
    }

    buildCode = (src: SourceJsonSourceAndTargetDir, skipJson: boolean): Promise<void[] | PathAndSha[]> =>
        (skipJson) ? this.validate(src, skipJson).then(() => this.tsxTransformer.loadAndtransformAllFiles(src)) : this.validate(src, skipJson).then(() => this.tsxTransformer.loadAndtransformAllFiles(src).then(this.jsonTransformer.updateJsonFiles(src)))
}
