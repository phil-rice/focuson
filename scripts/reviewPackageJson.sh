#!/usr/bin/env bash

function usage(){
  echo "usage reviewPackageJson.sh"
  echo "   this must be called from the root of the project, and must have a scripts subdirectory"
  echo "   it provides an ability to review what would be done to the  package.json in the project directories"
  echo "   the new package.json is called package.json.review"
}

if [ ! -d 'scripts' ]; then usage ; fi

scripts/inProjects.sh pwd | xargs -L1 scripts/applyPackageJsonTemplate.sh template package.review.json
