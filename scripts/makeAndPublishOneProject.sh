#!/usr/bin/env bash


function usage(){
  echo "usage fullPublish.sh scriptDir"
  echo "    in a project directory, if the project.details.json value 'projectDetails.publish' is true, this will npm install, tsc, npm test and finally npm publish "
  exit 2
}
if [ $# != 1 ]; then usage; fi

scriptDir=$(realpath $1)
publish=$(jq '.projectDetails.publish' < project.details.json)
if [ $? -ne 0 ]; then exit; fi
if [ "$publish" != true ]; then exit; fi

set -e
echo "Publishing $(pwd)"
rm -rf dist
echo "npm install"
npm install
echo "tsc"
tsc --noEmit false --outDir dist
echo "npm test"
npm test
echo "npm pack"
$scriptDir/pack.sh
set +e
echo "npm publish"
$scriptDir/publish.sh

echo "finished"
