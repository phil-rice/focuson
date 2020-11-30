#!/usr/bin/env bash

function usage(){
  echo "usage setupNpmRemoteLink.sh"
  echo "   this must be called from the root of the project, and must have a scripts subdirectory"
  echo "   It assumes the npm links for each project ave already been setup"
  echo "   Then it goes through the project.details.json and uses the symlinks based on the 'projectDetails.links' array"
  echo "   the new package.json is called package.review.json"
  exit 2
}
echo "one"
if [ $# -ne 1 ]; then usage; fi
if [ ! -d 'scripts' ]; then usage ; fi

#scripts/inProjects.sh "npm link"echo here
scripts/inProjects.sh pwd | while read line; do
   (cd $line
#   jq -r '.projectDetails| .links | .[]?' < project.details.json
    jq -r '.projectDetails| .links | .[]?' < project.details.json | xargs -L1 -r  npm link
   )
done
