#!/usr/bin/env bash

me=ideify2.sh
if [ $# -ne 0 ]; then
   echo "usage $me

   For each project in which there is   \"ideify\": true  in the project details file

     Searchs for all .ts and .tsx files in the current directory and below.
     For each one if there was an import of the project name it is replaces with a relative path to the project name

     This operation can be reversed with the script 'prepare.sh'
"
 exit 2
fi
laoban ls-ideify -a | while read line; do
    read dir from <<< $line
    grep -R --exclude-dir=node_modules --exclude-dir=dist "import.*$from"  --include='*.tsx' --include='*.ts' -l | while read file; do
         targetDir=`dirname $file`
         to=`realpath --relative-to=$targetDir $dir`
         sed "s#\"$from\";#\"$to\"; //changed from $from;#" -i $file
    done


done
