#!/usr/bin/env bash

set -e
tsc
cp package.json dist/package.json

cd dist
npm publish  --access public
