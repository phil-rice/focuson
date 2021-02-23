#!/usr/bin/env bash

me=prepare.sh
if [ $# -ne  0 ]; then
   echo "usage $me

   Searchs for all .ts and .tsx files in the current directory and below.
   For each one if there was an import of 'from' that had been changed by ideify.sh, and reverses the change
   It does this by looking for '//changed from [...]'

   examples
       $me @focuson/lens ../../modules/lens

"
 exit 2
 fi

grep -R --exclude-dir=node_modules --exclude-dir=dist "import.*; //changed from"  --include='*.tsx' --include='*.ts' -l  | xargs -L1 -r  sed "s#\"\(.*\)\; //changed from \(.*\);#\"\2\";#" -i