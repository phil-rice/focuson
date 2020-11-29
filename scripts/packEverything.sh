#!/usr/bin/env bash

function usage(){
  echo "usage packEverything.sh"
  echo "    this 'packs' all the projects that need it. It can be done prior to a publish to check what is being published"
  echo ""
  echo "currently the order is hard coded"
  exit 2
}

if [ $# -ne 0 ]; then usage; fi

packCmd=$(realpath scripts/pack.sh)
function doOne(){
  (cd $1
  echo "Packing $1"
  $packCmd  )
}
doOne nonfunctionals
doOne lens
doOne nav
doOne codeondemand

