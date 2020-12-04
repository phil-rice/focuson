#!/usr/bin/env node
'use strict';

/** Require dependencies */
import path from 'path';
import { Files } from './Files';
import * as fs from "fs";
const pkg = require('../package.json');
const commander = require('commander');
const { BuildCode } = require('./BuildCode');

const program = new commander.Command();
const files = new Files();

const buildFunction = (p: any) => {
  try {
    console.log('Source Directory: ', p.source);
    console.log('Data Source Directory: ', p.datasource);
    console.log('Destination Directory: ', p.destination);

    files.validateDirectoryExists("Source Directory", p.source)
      .then(() => {
        let skipJson = false;
        files.validateDirectoryExists("Json Source Directory", p.datasource)
          .then(() => {
            callBuildCode(skipJson);
          },
            (fserr) => {
              skipJson = true;
              callBuildCode(skipJson);
            })
      }).catch((err: Error) => { printErrorMessageAndExit(err) });;

    const callBuildCode = (skipJson: boolean) => {
      if (p.force) {
        console.log('Create destination directory, if not found: ', (p.force) ? 'Yes' : 'No');
        console.log('we will created directory', p.destination, path.parse(p.destination))
          fs.promises.mkdir(p.destination,  { recursive: true }).then(() => {
          console.log('Directories created');
          BuildCode.create().buildCode({ sourceDir: p.source, jsonSourceDir: p.datasource, targetDir: p.destination }, skipJson)
            .catch((err: Error) => { printErrorMessageAndExit(err) });
        });
      } else {
        BuildCode.create().buildCode({ sourceDir: p.source, jsonSourceDir: p.datasource, targetDir: p.destination }, skipJson)
          .catch((err: Error) => {
            const extraOption = err.message.includes(p.destination) ? ' Please use -f or --force option to create it on the fly.' : '';
            err.message = err.message.concat(extraOption);
            printErrorMessageAndExit(err);
          });
      }
    }
  }
  catch (e) {
    printErrorMessageAndExit(e);
  }
}

const printErrorMessageAndExit = (err: Error) => {
  console.log(err.message);
  process.exit(1);
}

program
  .version(pkg.version)
  .command('build')
  .option('-src, --source <source>', 'directory having components to build', 'src/render')
  .option('-dsrc, --datasource <datasource>', 'directory having JSON data', 'src/json')
  .option('-dest, --destination <destination>', 'directory for saving files after build', 'public/created')
  .option('-d, --debug', 'If specified some commands output more information about how they are working', false)
  .option('-f, --force', 'To create destination directory if not found')
  .description('Builds the code suitable for COD')
  .action(buildFunction);

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0)
  program.help();




