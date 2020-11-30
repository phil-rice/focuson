#!/usr/bin/env bash

function usage(){
  echo "usage installOneProject.sh logFile "
  echo "   executes npm install / tsc/ npm test  in the current irectory and records exit codes in log"
  exit 2
}

if [ $# -ne 1 ]; then usage $#; fi
log=$(realpath $1)
directory=$(pwd)

function log(){
   echo "$1 $2" >> $log
}


SECONDS=0
log "$directory"
npm install
log "    $directory npm install" $?
npm link
log "    $directory npm link" $?
jq -r '.projectDetails| .links | .[]?' < project.details.json | xargs -L1 -r  npm link
tsc
log "    $directory tsc" $?
npm test
log "    $directory npm test" $?
log "  $directory took ${SECONDS}s"
