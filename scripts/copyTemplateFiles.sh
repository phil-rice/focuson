#!/usr/bin/env bash

function usage(){
    echo "usage copyTemplateFiles.sh  <templateRootDirectory> <directory>"
    echo "    directory must have a project.details.json which selects which template is use"
    echo "   copies all files except package.json from the templateDirectory (and sub directories) to the directory, overwrite what is there"
    exit 2
}

if [ $# -ne 2 ]; then usage; fi

set -e
templateRootDirectory=$1
directory=$(realpath $2)

detailsFile="$directory/project.details.json"
if [ ! -f "$detailsFile" ]; then echo "Details file not found [$detailsFile]"; exit 3; fi

template=$( jq -r  '.template' < "$detailsFile")


cd $templateRootDirectory/$template
find . -type f  | grep -v package.json | xargs -L1 -I {}    cp {} $directory/{}
