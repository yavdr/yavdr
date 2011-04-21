#!/bin/bash

while getopts "d:" opt; do
  case $opt in
    d)
      DEVID=$OPTARG
      ;;
  esac
done

run-parts --verbose -a "-d" -a "$DEVID" /etc/sundtek.d/attach
