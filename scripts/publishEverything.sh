#!/usr/bin/env bash

function usage(){
  echo "usage publishEverything.sh scriptDir"
  echo "    this publishes all the projects that need it to npmjs"
  echo ""
  echo "currently the order is hard coded"
  exit 2
}

if [ $# -ne 1 ]; then usage;exit2; fi
scriptDir=$(realpath $1)
if [ ! -f $scriptDir/inProjects.sh ]; then echo "Scripts dir [$scriptDir] not valid"; exit 2; fi

fullPublish="$scriptDir/makeAndPublishOneProject.sh"
$scriptDir/updateProjects.sh
$scriptDir/inProjects.sh "$fullPublish $scriptDir"


