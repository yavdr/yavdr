#!/bin/bash

while getopts "d:s:h:a:" opt; do
  case $opt in
    d)
      DEVID=$OPTARG
      ;;
    h)
      HOST=$OPTARG
      ;;
    a)
      ADDRESS=$OPTARG
      ;;
    s)
      SERIAL=$OPTARG
      ;;
  esac
done

run-parts --verbose -a "-h" -a "$HOST" -a "-a" -a "$ADDRESS" -a "-d" -a "$DEVID" -a "-s" -a "$SERIAL" /etc/sundtek.d/mount
