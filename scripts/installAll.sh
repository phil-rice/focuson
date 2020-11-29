#!/usr/bin/env bash
log=$(mktemp)

function usage(){
  echo "usage installAll.sh logFile "
  echo "   executes 'installOneProject.sh' in each project directory"
  exit 2
}
set -e
if [ $# -ne 1 ]; then usage; fi
log=$(realpath $1)
SECONDS=0

function finish(){
  log "Total took ${SECONDS}s"
  echo
  echo "log is $log"
  cat $log
}
update=$(realpath scripts/installOneProject.sh)
scripts/inProjects.sh "$update $log"