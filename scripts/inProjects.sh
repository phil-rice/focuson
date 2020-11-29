#!/usr/bin/env bash

function usage(){
  echo "usage: inProjects cmd"
  echo "     the command is executed in each of the projects"
  echo "Expecting only one parameter, you specified $1 params. Did you forget quotes?"
  exit 2
}
if [ $# -ne 1 ]; then usage $#; fi

find . -type d \( -name node_modules -o -name dir2 -o -path name \) -prune -false -o -name 'project.details.json'  | sed 's#\(/[^/]*$\)##'| while read line; do
   (cd "$line"
   $1)
done
