#!/bin/bash

function checkmount()
{
    retry=3
    while [ $retry -gt 0 ]; do
        logger "testing for $1"
        sudo -u vdr touch $1/.update
        if [ $? -eq 0 ]; then
            logger "found $1"
            MOUNTS="$MOUNTS -v $1"
	    break
        else
            logger "sleeping"
	    sleep 1
            retry=$(expr $retry - 1)
        fi
    done
}

logger "executing $0"
if [ -e /etc/auto.net.yavdr ]; then
    logger "searching for video directories"
    for d in `cat /etc/auto.net.yavdr | awk '!/^#/ && /video/ {print $1}'`; do
        checkmount /net/$d
    done
    logger "adding \$MOUNTS to vdr: \"$MOUNTS\""
    OPTIONS="$OPTIONS $MOUNTS"
fi

