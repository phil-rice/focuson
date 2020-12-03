#!/usr/bin/env node
// 'use strict';

/** Require dependencies */
import path from 'path';
import { Files } from './Files';
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

    if (p.force) {
      console.log('Forcefully create Directory, if not found: ', (p.force) ? 'YES' : 'NO');
      files.createDirectoryForFile(path.parse(p.destination)).then(() => {
        console.log('Directories created');
        BuildCode.create().buildCode({ sourceDir: p.source, jsonSourceDir: p.datasource, targetDir: p.destination })
          .catch((err: Error) => {
            console.log(err.message);
            process.exit(1);
          });
      });
    } else {
      BuildCode.create().buildCode({ sourceDir: p.source, jsonSourceDir: p.datasource, targetDir: p.destination })
        .catch((err: Error) => {
          console.log(err.message);
          process.exit(1);
        });
    }
  }
  catch (e) {
    console.log(e.message);
    process.exit(1);
  }
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




