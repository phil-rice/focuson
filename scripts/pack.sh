#!/usr/bin/env bash

set -e
tsc
cp package.json dist/package.json

cd dist
find . -type f -name 'enzymeAdapterSetup.*' -delete
npm pack
