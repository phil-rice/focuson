#!/usr/bin/env bash

function usage(){
  echo "usage updateProjects.sh"
  echo "   this must be called from the root of the project, and must have a scripts subdirectory"
  echo "   all the projects have the template files copied to them, and the package.json updated"
  echo "   the old package.json is copied to package.old.json"
  echo "   "
}

if [ ! -d 'scripts' ]; then usage ; fi

scripts/inProjects.sh pwd | xargs -L1 scripts/applyPackageJsonTemplate.sh template package.json
scripts/inProjects.sh pwd | xargs -L1 scripts/copyTemplateFiles.sh template
