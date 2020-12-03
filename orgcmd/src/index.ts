#!/usr/bin/env node
// 'use strict';

/** Require dependencies */

import commander from "commander";
import { BuildCode } from "./BuildCode";
const pkg = require('../package.json');
const program = new commander.Command();

const buildFunction = (p: any) => {
  try {
    console.log('args', process.argv);
    console.log('dir', p.source, p.datasource, p.destination);
    BuildCode.create().buildCode({ sourceDir: p.source, jsonSourceDir: p.datasource, targetDir: p.destination });
  }
  catch (e) {
    console.log('Error', e);
  }
}

program
  .version(pkg.version)
  .command('build')
  .option('--source <source>', 'directory having components to build', 'src/render')
  .option('--datasource <datasource>', 'directory having JSON data', 'src/json')
  .option('--destination <destination>', 'directory for saving files after build', 'public/created')
  .option('--debug', 'If specified some commands output more information about how they are working', false)
  .description('Builds the code suitable for COD')
  .action(buildFunction);

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0)
  program.help();




