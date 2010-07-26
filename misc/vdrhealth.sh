#!/bin/bash
#
#  Copyright notice
#
#  (c) 2010 Henning Pingel
#  All rights reserved
#
#  This script is part of the yaVDR project. yaVDR is
#  free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#
#  The GNU General Public License can be found at
#  http://www.gnu.org/copyleft/gpl.html.
#  A copy is found in the textfile GPL.txt.
#
#  This script is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#

HOSTNAME="`hostname`"
TIMESTAMP="`date +%s`"
#current day of the current month (= today)
DATE_MONTHDAY="`date +"%b %d"`"
#trying to match any day of the current month
DATE_MONTHDAY="`date +"%b"` .+"
TRIGGERSTRING=""
#echo Hostname is $HOSTNAME / $DATE_MONTHDAY

#useful example setting
LOGLEVEL=64+32+8+16+2

function createRegex {

    REGEX_VDR=""
    REGEX_KERNEL=""
    REGEX_DVB=""
    REGEX_VDRSXFE=""

    echo "Loglevel: $LOGLEVEL"

    if [ $(( $LOGLEVEL & 1 )) == 1 ]; then
        REGEX_VDR=".*?exiting, exit code|.*?PANIC:|"
        echo "  1 = Showing abnormal VDR shutdowns (bad exit codes, Watchdog PANIC)"
    fi

    if [ $(( $LOGLEVEL & 2 )) == 2 ]; then
        REGEX_VDR="VDR version|$REGEX_VDR"
        echo "  2 = Showing VDR start messages"
    fi

    if [ $(( $LOGLEVEL & 4 )) == 4 ]; then
        REGEX_VDR=".*?shutdown|$REGEX_VDR"
        echo "  4 = Showing VDR shutdown messages"
    fi

    if [ $(( $LOGLEVEL & 8 )) == 8 ]; then
        REGEX_VDR="found .+ DVB device|$REGEX_VDR"
        echo "  8 = Showing number of DVB devices found by VDR on start"
    fi

    if [ $(( $LOGLEVEL & 16 )) == 16 ]; then
        REGEX_VDR="frontend .+ provides|$REGEX_VDR"
        echo " 16 = Showing details about DVB devices found"
    fi

    if [ $(( $LOGLEVEL & 32 )) == 32 ]; then
        REGEX_KERNEL_ONBOOT="kernel: imklog .*? log source \= \/proc\/kmsg started\."
        REGEX_KERNEL_ONSHUTDOWN="kernel: Kernel logging \(proc\) stopped\."
        REGEX_KERNEL="($REGEX_KERNEL_ONSHUTDOWN)|($REGEX_KERNEL_ONBOOT)"
        echo " 32 = Showing indications when machine was starting up / shutting down"
    fi

    if [ $(( $LOGLEVEL & 64 )) == 64 ]; then
        REGEX_DVB="kernel: \[.*?\] (DVB: registering|input: Sundtek)|$REGEX_DVB"
        echo " 64 = Showing registered DVB adapters (found by kernel)"
    fi

    if [ $(( $LOGLEVEL & 128 )) == 128 ]; then
        REGEX_DVB="kernel: \[.*?\] (dvb|.*?pctv|.*?stb(6100|0899))|$REGEX_DVB"
        echo "128 = Showing detailed messages regarding DVB devices found by kernel"
    fi

    if [ $(( $LOGLEVEL & 256 )) == 256 ]; then
        REGEX_VDRSXFE="(vdr-sxfe\[.+\]: \[.+\] .*?(failed|error|warning))"
        echo "256 = Showing problems with vdr-sxfe frontend"
    fi

    SEARCHSTRING=""

    if [ -n "${REGEX_VDR}" ]; then
        PID="\[[[:digit:]]+\]"
        #cut off last occurence of | (right trim) and wrap in wrapper
        SEARCHSTRING="(vdr: $PID (${REGEX_VDR%|}))|$SEARCHSTRING"
    fi

    if [ -n "${REGEX_KERNEL}" ]; then
        SEARCHSTRING="$REGEX_KERNEL|$SEARCHSTRING"
    fi

    if [ -n "${REGEX_DVB}" ]; then
        SEARCHSTRING="(${REGEX_DVB%|})|$SEARCHSTRING"
    fi

    if [ -n "${REGEX_VDRSXFE}" ]; then
        SEARCHSTRING="${REGEX_VDRSXFE%|}|$SEARCHSTRING"
    fi


    #cut off last |
    if [ -n SEARCHSTRING ]; then
        SEARCHSTRING=${SEARCHSTRING%|}
    fi

    #todo: still to be implemented
    #REGEX_VDR="(vdr: $PID recording )|(vdr-addon-acpiwakeup: Setting ACPI alarm time to:)|(vdr-shutdown: Shutdown aborted)|)"

    EGREPSTRING="$DATE_MONTHDAY ..:..:.. $HOSTNAME $SEARCHSTRING"
    echo GrepString: "$EGREPSTRING"
    echo -------------------------------------------------------------
}

function grepIt {
    LOGFILE=$1
    #echo Extension: \"${LOGFILE:(-3)}\"
    if [ ".gz" == "${LOGFILE:(-3)}" ]; then
        #echo "Detected gz file, using zegrep."
        GREPCMD="zegrep"
        TIMESPAN=""
    else
        GREPCMD="egrep"
        FIRSTLINE="`head -n 1 $LOGFILE`"
        LASTLINE="`tail -n 1 $LOGFILE`"
        TIMESPAN="(Timespan: ${FIRSTLINE:0:15} - ${LASTLINE:0:15})"
    fi
#    echo -------------------------------------------------------------
#    echo Examining file: $LOGFILE $TIMESPAN
#    echo -------------------------------------------------------------

    $GREPCMD -i "$EGREPSTRING" $LOGFILE
}

echo "*****************************************************************"
createRegex
#exit
grepIt "/var/log/syslog.7.gz"
grepIt "/var/log/syslog.6.gz"
grepIt "/var/log/syslog.5.gz"
grepIt "/var/log/syslog.4.gz"
grepIt "/var/log/syslog.3.gz"
grepIt "/var/log/syslog.2.gz"
grepIt "/var/log/syslog.1"
grepIt "/var/log/syslog"
echo "*****************************************************************"
