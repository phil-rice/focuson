#!/usr/bin/env bash

#This is complicated because environment variables have a max size so you can't read the file into memory
#Unfortunately the template filename is scanned multiple times, so we can't just stream it in
#Note: only replaces first occurance

function replace(){
  me="replaceStringInFileWithFile.sh"
  if [ $# != 3 ]; then
     echo "usage $me templateFilename stringToReplace contents"
     echo "  finds first occurance of 'stringToReplace' in the file templateFileName and replaces with the file 'contents'"
     exit 2
  fi

  templateFilename=$1
  stringToReplace=$2
  contents=$3
  lineNo=$(grep $stringToReplace $templateFilename -n | cut -f 1 -d ':')
  if [ "$lineNo" == "" ]; then
     cat $templateFilename
  else
      oneLess=$(($lineNo - 1))
      oneMore=$((lineNo + 1))
      head -$oneLess $templateFilename
      sed -n "${lineNo}s#^\(.*\)${stringToReplace}.*\$#\1#p" <$templateFilename   | tr -d '\n'
      cat $contents
      sed -n  "${lineNo}s#^.*${stringToReplace}\(.*\)\$#\1#p" <$templateFilename
      tail +$oneMore $templateFilename
  fi
}
temp1=`mktemp`
temp2=`mktemp`
temp3=`mktemp`

function finish(){
  rm $temp1
  rm $temp2
  rm $temp3
}
trap finish EXIT


replace src/index.html '%GAME%' src/game.js > $temp1
replace $temp1 '%BOARD%' src/board.js > $temp2
replace $temp2 '%SQUARE%' src/square.js > index.html



