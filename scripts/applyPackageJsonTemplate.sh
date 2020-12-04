#!/usr/bin/env bash


function usage(){
   echo "usage: applyPackageJsonTemplate.sh <templateRoot>  <name> <directory> "
   echo "    templateRoot is the directory holding the templates."
   echo "    name is the name of the created package.json. Typically package.json or package.review.json "
   echo "    directory must hold package.details.json"
   echo
   echo " This will create a new file 'name' and will copy the existing package.json to package.old.json"
   echo
   echo "A common pattern is scripts/inProjects.sh pwd | xargs -L1 scripts/applyTemplate.sh template"
   exit 2
}

if [ $# -ne 3 ]; then usage;  fi

set -e
templateRoot=$1
packageJsonName=$2
directory=$3
detailsFile="$directory/project.details.json"
version=$(cat $templateRoot/version.txt)
echo "Template Directory [$templateRoot] name [$packageJsonName] DetailsFile [$detailsFile] Version [$version]"
if [ ! -f "$detailsFile" ]; then echo "Details file not found [$detailsFile]"; exit 3; fi

function findTemplateDirectory(){
    jq -r  '.template' < "$detailsFile"
}

function makePackageJson(){
  jq --sort-keys --argjson details "$(cat $detailsFile)" '
      (. + $details) +
      ({dependencies:
         (.dependencies +        ($details.projectDetails.extraDeps)   +
         (reduce $details.projectDetails.links[]? as $i ({}; .[$i] = "<version>" )))
      }) +
      ({devDependencies: (.devDependencies + $details.projectDetails.extraDevDeps)}) +
      ({bin: ((if has("bin") then .bin else {} end) + $details.projectDetails.extraBins )})
       ' < "$templateDirectory/package.json"
}
#                           (reduce $details.projectDetails.links[]? as $i ({}; .[$i] = "<version>" ))})+

template="$(findTemplateDirectory)"
templateDirectory="$templateRoot/$template"
if [ -f "$directory/package.json" ]; then
   cp $directory/package.json $directory/package.old.json
fi
makePackageJson | sed -e "s/<version>/$version/g" > $directory/$packageJsonName
#echo "package.json created in $directory/$packageJsonName"