#!/bin/bash

if [[ $BUILD == TRUE ]] ; then
    echo "Building deps ..."
    npm install typescript -g
    npm install
    tsc
    exit 0
fi

if [[ $FTEST == TRUE ]] ; then
    echo "Starting ftest ..."
    node dist/test.js
    exit 0
fi

echo "Starting app ..."
node dist/index.js