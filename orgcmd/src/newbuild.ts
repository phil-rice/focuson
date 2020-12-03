import { BabelFile } from "@babel/core";
import { runInNewContext } from "vm";

const fsp = require('fs').promises;
// import { ParsedPath } from "path";
const path = require('path');
const babel = require("@babel/core");
const shajs = require('sha.js');

const srcDir: string = 'src/render';
const jsonSrcDir: string = 'src/json';
const targetDir: string = 'public/created';
let allShas: PathAndSha[] = [];

interface FinalOutcome {
    shaCode: string,
    transpiledCode: string
}

export interface PathAndSha {
    path: string,
    sha: string
}

fsp.readdir(path.join(srcDir))
    // .then((filename: string) => filename)
    .then((files: string[]) =>
        // console.log('files', files);
        Promise.all(files.map((file: string) => {
            fsp.readFile(path.join(srcDir, file), 'utf-8')
                .then((contents: string) => {
                    const contentsWithNoImports = contents.replace(/^import.*$/gm, '');
                    // console.log('file contents - after', contents.replace(/^import.*$/gm, ''));
                    //.replace(/^\s*[\r\n]/gm, '')); Need to fix this - blank line removal
                    babel.transformAsync(contentsWithNoImports)
                        .then((result: BabelFile) => {
                            const babelCode = result.code.replace('"use strict";', '').trim();
                            // Add return statement at the end
                            const appendStr = `return ${path.parse(file).name};`;
                            const transformedContents = `${babelCode}
${appendStr}`;
                            // console.log('transformedContents', transformedContents);
                            return transformedContents;
                        })
                        .then((transpiledCode: string) => {
                            // console.log('transpiled code', transpiledCode);
                            const shaCode = shajs('sha256').update(transpiledCode).digest('hex');
                            allShas.push({
                                path: file,
                                sha: shaCode
                            });

                            // console.log('allShas', allShas);

                            return { shaCode, transpiledCode };
                        })
                        .then((finalResult: FinalOutcome) =>
                            fsp.writeFile(path.join(targetDir, path.parse(file).name, finalResult.shaCode), finalResult.transpiledCode, 'utf-8')
                                .then((err: Error) => {
                                    if (err) return console.log(err);
                                    console.log(`${path.join(targetDir, path.parse(file).name, finalResult.shaCode)} created`);
                                })
                        )
                })
        })
        )
    )
    .then(() => {
        console.log('test');
        return Promise.resolve('123');
    })
    .then((result: string) => {
        console.log('result', result);
        fsp.readdir(path.join(jsonSrcDir))
            .then((jsonFiles: string[]) => {
                Promise.all(jsonFiles.map((jsonFile: string) =>
                    fsp.readFile(path.join(jsonSrcDir, jsonFile))
                        .then((jsonContents: string) => {
                            // let str = jsonContents;
                            allShas.map((singleSha: PathAndSha) => {
                                const name = path.parse(singleSha.path).name;
                                jsonContents = jsonContents.toString().replace(new RegExp(`#${name}/render#`, 'gi'), `created/${name}/${singleSha.sha}`);
                            });
                            // let newJsonContents = str;
                            fsp.writeFile(path.join(targetDir, jsonFile), jsonContents, 'utf-8')
                                .then((err: Error) => {
                                    if (err) return console.log(err);
                                    console.log(`JSON Updated: ${path.join(targetDir, jsonFile)} created`);
                                });
                        })
                ))
            })
    });
