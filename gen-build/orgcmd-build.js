#!/usr/bin/env node

const buildCode = (srcDir, jsonSrcDir, targetDir) => {
    const fs = require('fs');
    const path = require('path');
    const babel = require("@babel/core");
    const shajs = require('sha.js');

    console.time('buildScriptExecutionTime');
    console.log('Script execution started');

    let files = null;
    let allShas = {};

    // Command-line arguments, if any
    // const [, , , srcDir, jsonSrcDir, targetDir, ...args] = process.argv;
    console.log('args', srcDir, jsonSrcDir, targetDir);

    if (fs.lstatSync(srcDir).isDirectory()
        && fs.lstatSync(jsonSrcDir).isDirectory()
        && fs.lstatSync(targetDir).isDirectory()) {
        // if (srcDir && jsonSrcDir && targetDir) {
        try {
            // Read files from the folder
            // console.log('Read files from folder');
            files = fs.readdirSync(srcDir);
            createDirectories(targetDir);
            readFiles();
        }
        catch (e) {
            console.log("ERROR: ", e);
        }
    }


    function readFiles() {
        files.forEach((file, index) => {
            console.log(`file ${index}`, file);

            // Filename without extension
            const [fileNameNoExt, ...fileProps] = file.split('.');

            // Read file content
            fs.readFile(path.join(srcDir, file), 'utf-8', function (err, contents) {
                if (err) {
                    return console.log(err);
                }

                // Remove import statements and blank newlines too
                let newContents = contents.replace(/^import.*$/gm, '').replace(/^\s*[\r\n]/gm, '');

                // Babel transform the code
                babel.transformAsync(newContents).then(result => {
                    const babelCode = result.code.replace('"use strict";', '').trim();

                    // Add return statement at the end
                    const appendStr = `return ${fileNameNoExt};`;
                    const transformedContents = `${babelCode}
        ${appendStr}`;

                    const sha256Code = shajs('sha256').update(transformedContents).digest('hex');

                    fs.stat(path.join(targetDir, fileNameNoExt, sha256Code), function (err, stat) {
                        if (err == null) {
                            console.log(`${path.join(targetDir, fileNameNoExt, sha256Code)} exists`);
                        } else if (err.code === 'ENOENT') {
                            // file does not exist. Create sha files and write updated content to it
                            fs.writeFile(path.join(targetDir, fileNameNoExt, sha256Code), transformedContents, 'utf-8', function (err) {
                                if (err) return console.log(err);
                                console.log(`${path.join(targetDir, fileNameNoExt, sha256Code)} created`);
                            });
                        } else {
                            console.log('Some other error: ', err.code);
                        }
                    });

                    // Remove any other files
                    // removeOtherFiles(path.join(targetDir, fileNameNoExt), sha256Code);

                    // e.g- allShas['#SimpleFilter/render#'] = "created/SimpleFilter/ShaCode";
                    allShas[`#${fileNameNoExt}/render#`] = `created/${fileNameNoExt}/${sha256Code}`;

                    if (Object.keys(allShas).length === files.length) {
                        updateJsonFiles();
                    }
                });
            });
        });
    };

    function updateJsonFiles() {
        const jsonFiles = fs.readdirSync(jsonSrcDir);

        jsonFiles.forEach((file, index) => {
            fs.readFile(path.join(jsonSrcDir, file), 'utf-8', function (err, contents) {
                if (err) {
                    return console.log(err);
                }

                // Replace - #SimpleFilter/render# with  created/SimpleFilter/ed20e24e52282c8001ed33df5cfb383784ee236c5297236d97ab60294d4aff41
                let newContents = replaceMultipleStrings(contents);

                // Write updated content to file
                fs.writeFile(path.join(targetDir, file), newContents, 'utf-8', function (err) {
                    if (err) return console.log(err);
                });
            });
        });
    }

    function replaceMultipleStrings(str) {
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
                    fs.mkdir(dirPath, { recursive: true }, (err) => {
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
    });
}

module.exports = { buildCode };

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
