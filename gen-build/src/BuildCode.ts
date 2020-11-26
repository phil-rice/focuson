#!/usr/bin/env node

import {SourceAndTargetDir, TsxTransformer} from "./TsxTransformer";
import {JsonSourceDirAndTargetDir, JsonTransformer} from "./JsonTransformer";
import {Files} from "./Files";

interface SourceJsonSourceAndTargetDir extends SourceAndTargetDir, JsonSourceDirAndTargetDir {}

class BuildCode {
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

    validate(src: SourceJsonSourceAndTargetDir) {
        return Promise.all([this.tsxTransformer.validate(src), this.jsonTransformer.validate(src)])
    }

    buildCode = (src: SourceJsonSourceAndTargetDir): Promise<void[]> =>
        this.validate(src).then(() => this.tsxTransformer.loadAndtransformAllFiles(src).then(this.jsonTransformer.updateJsonFiles(src)))
}
