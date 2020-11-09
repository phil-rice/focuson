#!/usr/bin/env bash

urlRoot=created
targetDir=public/$urlRoot
logDir=src/$urlRoot

mkdir -p $targetDir
mkdir -p $logDir

log="$logDir/shas.js"

tempDir=$(mktemp -d)
tempOutDir=$(mktemp -d)
function finish(){
   rm -r $tempDir
   rm -r $tempOutDir
}

trap finish EXIT

function copyOne(){
  from=$1
  file="src/domain/$from.js"
  if [ ! -f "$file" ] ; then echo "Cannot find $file"; exit 2; fi

  tempFile=$tempDir/$from.js
  tempOutFile=$tempOutDir/$from.js
  parent="$targetDir/$from"
  mkdir -p $parent


  tail +2 $file > $tempFile
  (
    cd $tempDir
    babel $from.js --out-dir $tempOutDir > /dev/null
  )
  read sha junk <<< $(sha256sum "$tempOutFile")

  to="$parent/$sha"
  cp $tempOutFile $to
  url="$urlRoot/$from/$sha"
  printf '    %s: "%s",\n' $from $url >> "$log"
  echo $sha
}

function removeLastComma(){
   sed -i '$s/,$//' "$1"
}

echo "export let shas={//This is a bodge to avoid needing a server while we are still in the playground" > $log
#copyOne game
gameSha=$(copyOne game)
boardSha=$(copyOne board)
squareSha=$(copyOne square)
square2Sha=$(copyOne square2)

removeLastComma $log

echo "}" >> $log

function makeGameJson(){
  jsonName=$1
  gameSha=$2
  boardSha=$3
  squareSha=$4
echo '{
    "_links": {"_self": {"href": "created/'$jsonName'"}},
    "_render": {"_self": "'created/board/$gameSha'"},
    "gameData": "Some game data properties could go here",
    "_embedded": {
        "board": {
            "_links": {"_self": {"href": "/not/Used/Yet"}},
            "_render": {"_self": "created/board/$boardSha", "square":"created/square/'$squareSha'"},
            "squares": [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
    }
}' > $targetDir/$jsonName
}
makeGameJson gameJson1.json $gameSha $boardSha $squareSha
makeGameJson gameJson2.json $gameSha $boardSha $square2Sha
