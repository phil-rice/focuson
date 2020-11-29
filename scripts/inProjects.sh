#!/usr/bin/env bash

function usage(){
  echo "usage: inProjects cmd"
  echo "     the command is executed in each of the projects"
  echo "Expecting only one parameter, you specified $1 params. Did you forget quotes?"
  exit 2
}
if [ $# -ne 1 ]; then usage $#; fi

find . -type d \( -name node_modules -o -name dir2 -o -path name \) -prune -false -o -name 'project.details.json' | while read file; do
   dir=$(sed -e 's#\(/[^/]*$\)##' <<< $file)
   generation=$(jq -r -e  '.projectDetails.generation' 2>/dev/null < $file)
   if [ $? -ne 0 ]; then >&2 echo "project $file needs a generation"; fi
   echo "$generation $dir"
done | sort -k1,1 |while read generation file ; do
   (
   cd "$file"
   $1)
done
