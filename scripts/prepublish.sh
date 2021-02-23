#!/usr/bin/env bash

me=prepubish.sh
if [ $# -ne  0 ]; then
   echo "usage $me

      runs everything you need to prepubish.

      WARNING!!! This will clear all your logs and status. If you want to publish without that happening you can do the steps manually


"
 exit 2
 fi

set -e
echo "preparing"
scripts/prepare.sh    # Removes the effects of scripts/ideify.sh
laoban update         # updates all projects with the version number
yarn                  # Makes sure that everything is up to date

laoban clean && laoban tsc && laoban test && laoban status
echo
echo "Check that the status for tsc and tests is 'true' in all projects"
echo "then you can type"
echo "        laoban publish && loaban status"

