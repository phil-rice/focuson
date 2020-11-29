#!/usr/bin/env bash
log=$(mktemp)

function usage(){
  echo "usage installAll.sh logFile "
  echo "   executes 'installOneProject.sh' in each project directory"
  if [ "$1" -eq 0 ]; then echo "Don't forget to specify a logfile"; fi
  exit 2
}
if [ $# -ne 1 ]; then usage $#; fi
log=$(realpath $1)
SECONDS=0

function finish(){
  echo "Total took ${SECONDS}s" >> $log
  echo
  echo "log is $log"
  cat $log
}
trap finish EXIT

update=$(realpath scripts/installOneProject.sh)
scripts/inProjects.sh "$update $log"