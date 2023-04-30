#!/bin/bash

clear

echo "Select action:"
echo "      1. Start controller app"
echo "      2. Start controller app as daemon"
echo "      3. Start FTest"
echo "      4. Build controller app"
echo "      5. Exit"
printf ">"

read key

case $key in
    "1")
        FTEST= BUILD= docker-compose up
        echo $?
    ;;

    "2")
        FTEST= BUILD= docker-compose up -d
    ;;

    "3")
        FTEST=TRUE BUILD= docker-compose up
    ;;

    "4")
        FTEST= BUILD=TRUE docker-compose up
    ;;

    "5")
        exit 0
    ;;
esac