#!/usr/bin/env node
'use strict';

/** Require dependencies */
const pkg = require('./package.json');
const commander = require('commander');
const orgCmdObj = require('./orgcmd-build');

const program = new commander.Command();

const buildFunction = (p) => {
  console.log('dir', p.source, p.datasource, p.destination);
  // console.log("Reads the files from source directories, builds it and saves it in the target directory");
  console.log(orgCmdObj.buildCode(p.source, p.datasource, p.destination));
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




