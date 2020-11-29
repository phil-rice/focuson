#!/usr/bin/env bash

function usage(){
  echo "usage setupNpmLink.sh"
  echo "   this must be called from the root of the project, and must have a scripts subdirectory"
  echo "   It finds the project directories (has a project.details.json) and setsup the symlinks for them (npm link in that directory)"
  echo "   Then it goes through the project.details.json and uses the symlinks based on the 'projectDetails.links' array"
  echo "   the new package.json is called package.review.json"
}

if [ ! -d 'scripts' ]; then usage ; fi

scripts/inProjects.sh "npm link"

scripts/inProjects.sh pwd | while read line; do
   (cd $line
    jq -r '.projectDetails| .links | .[]?' < project.details.json | xargs -L1 -r   npm link
   )
done
