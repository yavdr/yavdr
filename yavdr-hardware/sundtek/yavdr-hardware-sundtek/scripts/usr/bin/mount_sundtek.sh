#!/bin/bash

while getopts "d:s:h:" opt; do
  case $opt in
    d)
      DEVID=$OPTARG 
      ;;
    h)
      HOST=$OPTARG 
      ;;
    s)
      SERIAL=$OPTARG 
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

run-parts --verbose -a "-h" -a "$HOST" -a "-d" -a "$DEVID" -a "-s" -a "$SERIAL" /etc/sundtek.d/mount
