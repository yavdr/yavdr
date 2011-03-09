#!/bin/bash

while getopts "d:" opt; do
  case $opt in
    d)
      DEVID=$OPTARG 
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

run-parts --verbose -a "-d" -a "$DEVID" /etc/sundtek.d/detach
