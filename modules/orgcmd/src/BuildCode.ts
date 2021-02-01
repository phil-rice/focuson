#!/usr/bin/env node
//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS

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
