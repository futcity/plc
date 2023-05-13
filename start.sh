#!/bin/bash

if [[ $FTEST == TRUE ]] ; then
    echo "Starting ftest ..."
    npm test
    exit 0
fi

echo "Starting app ..."
npm start