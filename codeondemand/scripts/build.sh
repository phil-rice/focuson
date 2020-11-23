#!/usr/bin/env bash

urlRoot=created
targetDir=public/$urlRoot
renderDir=src/render
jsonDir=src/json

mkdir -p $targetDir

shasFile="$targetDir/shas.sh"

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
  file=$1
  from=$2
  ext='.tsx'
  if [ ! -f "$file" ] ; then echo "Cannot find $file"; exit 2; fi

  tempFile=$tempDir/$from$ext
  tempOutFile=$tempOutDir/$from.js
  parent="$targetDir/$from"
  mkdir -p $parent


  removeImports < $file > $tempFile
  (
    cd $tempDir
    babel $from$ext --out-dir $tempOutDir --source-maps true> /dev/null
    )
  echo >>$tempOutFile
  echo "return $from"| sed -e ' s/Square2/Square/'  >> $tempOutFile

  read sha junk <<< $(sha256sum "$tempOutFile")

  to="$parent/$sha"
  cp $tempOutFile $to
#  cp $tempOutFile.map $to.map   //reenable if you want to have the source maps next to the file
  url="$urlRoot/$from/$sha"
  printf "    -e 's^#$from/render#^$url^g'  "  >> "$shasFile"
  echo "  $sha"
}

printf "#!/usr/bin/env bash
sed    " > $shasFile
#copyOne game
#exit
for file in $renderDir/*; do
  justfilename=$(basename -- "$file")
  filename="${justfilename%.*}"
  echo "compiling $file $filename"
  copyOne $file $filename
done

chmod u+x $shasFile
for file in $jsonDir/*; do
  to=$(basename -- "$file")
  echo "Json $file => $to"
  $shasFile < $file > $targetDir/$to
done
