#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const babel = require("@babel/core");
const shajs = require('sha.js');


function generateShaAndSaveFile(transformedContents: string, targetDir: string, fileNameNoExt: string): Promise<string> {
    const sha256Code = shajs('sha256').update(transformedContents).digest('hex');
    return fs.stat(path.join(targetDir, fileNameNoExt, sha256Code)).then(stat => {
            console.log(`${path.join(targetDir, fileNameNoExt, sha256Code)} exists`);
            return sha256Code
        }, err => {
            if (err.code === 'ENOENT') {
                // file does not exist. Create sha files and write updated content to it
                fs.writeFile(path.join(targetDir, fileNameNoExt, sha256Code), transformedContents, 'utf-8').//
                    then(() => {
                        console.log(`${path.join(targetDir, fileNameNoExt, sha256Code)} created`)
                        return sha256Code
                    });
            } else {
                console.log('Some other error: ', err.code);
            }
        }
    );
}


function transformTheCodeAfterBabel(fileNameNoExt: string, result: { code: string }) {
    const babelCode = result.code.replace('"use strict";', '').trim();
    const appendStr = `return ${fileNameNoExt};`;
    const transformedContents = `${babelCode}
        ${appendStr}`;
    return transformedContents
}

const remoteImportStatementsAndBlankNewLines = (contents: string) =>
    contents.replace(/^import.*$/gm, '').replace(/^\s*[\r\n]/gm, '');

const transformCode = (contents: string) => babel.transformAsync(remoteImportStatementsAndBlankNewLines(contents)).then(transformTheCodeAfterBabel);

function getExtension(file: string) {
    const [fileNameNoExt, ...fileProps] = file.split('.');
    return fileNameNoExt;
}
interface FilenameAndSha {
    fileNameNoExt: string,
    sha: string
}
function loadAndTransformOneFile(srcDir: string, file: string, targetDir: string): Promise<FilenameAndSha> {
    console.log(`file `, file);
    let fileNameNoExt = getExtension(file);
    return fs.readFile(path.join(srcDir, file), 'utf-8').//
        then(transformCode).//
        then(transformedContents => generateShaAndSaveFile(transformedContents, targetDir, fileNameNoExt)).//
        then(sha => ({fileNameNoExt: fileNameNoExt, sha: sha}))
}


function readFiles(srcDir: string, targetDir: string, files: string[]): Promise<FilenameAndSha[]> {
    return Promise.all(files.map((file) => loadAndTransformOneFile(srcDir, file, targetDir)))
}

function buildCode(srcDir, jsonSrcDir, targetDir): Promise<Map<string, string>> {
    console.time('buildScriptExecutionTime');
    console.log('Script execution started');
    console.log('args', srcDir, jsonSrcDir, targetDir);

    createDirectories(targetDir);
    if (fs.lstatSync(srcDir).isDirectory()
        && fs.lstatSync(jsonSrcDir).isDirectory()
        && fs.lstatSync(targetDir).isDirectory()) {
        // if (srcDir && jsonSrcDir && targetDir) {

        let files: string[] = fs.readdirSync(srcDir);
        return readFiles(srcDir, targetDir, files).then(turnArrayIntoMap);
    } else return Promise.reject(Error('Cannot create'))
}


function turnArrayIntoMap(listOfFilesAndShas: FilenameAndSha[]): Map<string, string> {
    const map = new Map()
    listOfFilesAndShas.reduce((map, obj) => {
        map[obj.fileNameNoExt] = obj.sha;
        return map;
    })
    return map
}

function turnListOfFilesAndShasIntoTemplateKeyAndValue(map: Map<string, string>) {
    const result = new Map()
    for (let key in map) {result[`#${key}/render#`] = `created/${key}/${map.get(key)}`}
    return result
}

function buildFilesAndUpdateJsonFiles(srcDir, jsonSrcDir, targetDir) {
    buildCode(srcDir, jsonSrcDir, targetDir).then(map => updateJsonFiles(jsonSrcDir, targetDir, map))
}

function processOneJsonFile(jsonSrcDir: string, targetDir: string, file: string, mapOfFileNameToSha: Map<string, string>): Promise<void> {
    return fs.readFile(path.join(jsonSrcDir, file), 'utf-8').//
        then(contents => fs.writeFile(path.join(targetDir, file), replaceMultipleStrings(mapOfFileNameToSha, contents), 'utf-8'))
}

function updateJsonFiles(jsonSrcDir: string, targetDir: string, mapOfFileNameToSha) {
    const templateKeyAndValue = turnListOfFilesAndShasIntoTemplateKeyAndValue(mapOfFileNameToSha)
    return fs.readdir(jsonSrcDir).then(files => {
            files.forEach(file => processOneJsonFile(jsonSrcDir, targetDir, file, templateKeyAndValue));
        }
    )
}

function replaceMultipleStrings(mapOfFileNameToSha, str) {
    let newStr = '';

    for (key in allShas) {
        str = str.replace(new RegExp(key, 'gi'), allShas[key]);
    }

    return str;
}


function createDirectories(dPath) {
    files.forEach((file, index) => {
        const [fileNameNoExt, ...fileProps] = file.split('.');
        const dirPath = path.join(dPath, fileNameNoExt);
        fs.access(dirPath, (err) => {
            if (err) {
                console.log(`Directory ${dirPath} does not exist. Creating...`);
                fs.mkdir(dirPath, {recursive: true}, (err) => {
                    if (err) throw err;
                    console.log("created", dirPath);
                });
            } else {
                console.log(`Directory ${dirPath} exists.`);
            }
        });

    });
}

process.on('exit', function (code) {
    console.log(`Script execution complete.`);
    return console.timeEnd('buildScriptExecutionTime');
})

s
/*let files = null;
let allShas = {};

if (fs.lstatSync(srcDir).isDirectory() && fs.lstatSync(jsonSrcDir).isDirectory() && fs.lstatSync(targetDir).isDirectory()) {
    // if (srcDir && jsonSrcDir && targetDir) {
    try {
        // Read files from the folder
        files = fs.readdirSync(srcDir);
        createDirectories(targetDir);
        readFiles();
    }
    catch (e) {
        console.log("ERROR: ", e);
    }
}
*/


/*
function removeOtherFiles(directory, retainFile) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.log(err);
        }

        files.forEach(file => {
            const fileWithPath = path.join(directory, file);

            if (file !== retainFile) {
                console.log(`${fileWithPath} removed`);
                fs.unlinkSync(fileWithPath);
            }
        });
    });
}
*/
// process.on('exit', function (code) {
//     console.log(`Script execution complete.`);
//     return console.timeEnd('buildScriptExecutionTime');
// });
