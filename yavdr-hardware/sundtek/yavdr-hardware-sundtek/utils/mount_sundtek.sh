#!/bin/bash

run-parts --verbose -a "$1" -a "$2" -a "$3" /etc/sundtek.d/mount
