#!/usr/bin/env bash

targetDir=public
logDir=src/created

mkdir -p $logDir
log="$logDir/shas.js"

temp=$(mktemp)
function finish(){
   rm $temp
}

trap finish EXIT

function copyOne(){
  from=$1
  file="src/domain/$from.js"
  if [ ! -f "$file" ] ; then echo "Cannot find $file"; exit 2; fi

  tail +2 $file > $temp
  read sha junk <<< $(sha256sum "$temp")
  parent="$targetDir/created/$from"
  mkdir -p $parent
  to="$parent/$sha"
  echo  copying  "$file" "===>" "$to"
  cp $temp "$to"
  url="created/$from/$sha"
  printf '    %s: "%s",\n' $from $url >> "$log"
}
function removeLastComma(){
sed -i '$s/,$//' "$1"

}

echo "export let shas={//This is a bodge to avoid needing a server while we are still in the playground" > $log

copyOne game
copyOne board
copyOne square
copyOne square2
removeLastComma $log

echo "}" >> $log

