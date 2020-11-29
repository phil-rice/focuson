#!/usr/bin/env bash

function usage(){
  echo "usage publishEverything.sh"
  echo "    this publishes all the projects that need it to npmjs"
  echo ""
  echo "currently the order is hard coded"
  exit 2
}

if [ $# -ne 0 ]; then usage; fi


