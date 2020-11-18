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

function removeImports(){
   sed -e '/^\s*import/d'
}
function copyOne(){
  from=$1
  returnCmd=$2
  ext='.tsx'
  file="src/domain/$from$ext"
  if [ ! -f "$file" ] ; then echo "Cannot find $file"; exit 2; fi

  tempFile=$tempDir/$from$ext
  tempOutFile=$tempOutDir/$from.js
  parent="$targetDir/$from"
  mkdir -p $parent


  removeImports < $file > $tempFile
  (
    cd $tempDir
    babel $from$ext --out-dir $tempOutDir > /dev/null
  )
  read sha junk <<< $(sha256sum "$tempOutFile")

  to="$parent/$sha"
  cp $tempOutFile $to
  echo "return $returnCmd" >> $to
  url="$urlRoot/$from/$sha"
  printf '    %s: "%s",\n' $from $url >> "$log"
  echo $sha
}

function removeLastComma(){
   sed -i '$s/,$//' "$1"
}

echo "export let shas={//This is a bodge to avoid needing a server while we are still in the playground" > $log
#copyOne game

gameSha=$(copyOne Game Game)
boardSha=$(copyOne Board Board)
squareSha=$(copyOne Square Square)
square2Sha=$(copyOne Square2 Square)

removeLastComma $log

echo "}" >> $log

function makeGameJson(){
  jsonName=$1
  gameSha=$2
  boardSha=$3
  squareSha=$4
echo '{
    "_links": {"_self": {"href": "created/'$jsonName'"}, "game1":{"href":"created/gameJson1.json"}, "game2":{"href":"created/gameJson2.json"}},
    "_render": {"_self": "created/game/'$gameSha'"},
    "gameData": "Some game data properties could go here",
    "_embedded": {
        "board": {
            "_links": {"_self": {"href": "/not/Used/Yet"}},
            "_render": {"_self": "created/board/'$boardSha'", "square":"created/square/'$squareSha'"},
            "squares": ["", "", "", "", "", "", "", "", ""]
        }
    }
}' > $targetDir/$jsonName
}
makeGameJson gameJson1.json $gameSha $boardSha $squareSha
makeGameJson gameJson2.json $gameSha $boardSha $square2Sha
