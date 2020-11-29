#!/usr/bin/env bash

function usage(){
    echo "usage copyTemplateFiles.sh  <templateDirectory> <directory>"
    echo "   copies all files except package.json from the templateDirectory (and sub directories) to the directory, overwrite what is there"
    exit 2
}

if [ $# -ne 2 ]; then usage; fi

set -e
templateDirectory=$1
directory=$(realpath $2)
cd $templateDirectory

find . -type f  | grep -v package.json | xargs -L1 -I {}   echo cp {} $directory/{}.review
find . -type f  | grep -v package.json | xargs -L1 -I {}   cp {} $directory/{}.review
