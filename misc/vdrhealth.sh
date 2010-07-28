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

#use this if you are trying to match any day of the current month
DATE_MONTHDAY="`date +"%b"` [[:digit:]]+"

#use this if you are trying to match any day of any month
DATE_MONTHDAY="... [[:digit:]]+"


TRIGGERSTRING=""

#HOURS MINUTES SECONDS (=HMS)
HMS="..:..:.."

#useful example setting
LOGLEVEL_VDR=127
LOGLEVEL_KERNEL=2
LOGLEVEL_DVB=3
LOGLEVEL_VDRSXFE=1

LOGLEVEL_VDR=31
LOGLEVEL_KERNEL=3
LOGLEVEL_DVB=1
LOGLEVEL_VDRSXFE=0


function createRegex {

    REGEX_VDR=""
    REGEX_KERNEL=""
    REGEX_DVB=""
    REGEX_VDRSXFE=""
    REGEX_EXTRAS=""

    echo "Loglevel: $LOGLEVEL_VDR"

    #################################################################
    # VDR
    #################################################################

    if [ $(( $LOGLEVEL_VDR & 1 )) == 1 ]; then
        REGEX_VDR=".*?exiting, exit code|.*?PANIC:"
        echo "  1 = Showing abnormal VDR shutdowns (bad exit codes, Watchdog PANIC)"
    fi

    if [ $(( $LOGLEVEL_VDR & 2 )) == 2 ]; then
        REGEX_VDR="VDR version|$REGEX_VDR"
        echo "  2 = Showing VDR start messages"
    fi

    if [ $(( $LOGLEVEL_VDR & 4 )) == 4 ]; then
        REGEX_VDR=".*?shutdown|.*?Netwatcher thread ended|$REGEX_VDR"
        REGEX_EXTRAS="init: vdr main process (.*?) killed|$SEARCHSTRING"
        echo "  4 = Showing VDR shutdown messages"
    fi

    if [ $(( $LOGLEVEL_VDR & 8 )) == 8 ]; then
        REGEX_VDR="found .+ DVB device|$REGEX_VDR"
        echo "  8 = Showing number of DVB devices found by VDR on start"
    fi

    if [ $(( $LOGLEVEL_VDR & 16 )) == 16 ]; then
        REGEX_VDR="frontend .+ provides|$REGEX_VDR"
        echo " 16 = Showing details about DVB devices found"
    fi

    if [ $(( $LOGLEVEL_VDR & 32 )) == 32 ]; then
        REGEX_VDR="frontend .*? timed out while tuning to channel|$REGEX_VDR"
        echo " 32 = Showing details about frontend timeouts"
    fi

    if [ $(( $LOGLEVEL_VDR & 64 )) == 64 ]; then
        REGEX_VDR=".*?recording|$REGEX_VDR"
        echo " 64 = Showing details about recordings"
    fi

    #################################################################
    # KERNEL (Boot/Shutdown)
    #################################################################

    if [ $(( $LOGLEVEL_KERNEL & 1 )) == 1 ]; then
        REGEX_KERNEL="(kernel: imklog .*? log source .*? started\.)|$REGEX_KERNEL"
        echo "  1 = Showing indications when machine was starting up"
    fi

    if [ $(( $LOGLEVEL_KERNEL & 2 )) == 2 ]; then
        REGEX_KERNEL="(kernel: Kernel logging \(proc\) stopped\.)|$REGEX_KERNEL"
        echo "  2 = Showing indications when machine was shutting down"
    fi

    #################################################################
    # DVB
    #################################################################

    if [ $(( $LOGLEVEL_DVB & 1 )) == 1 ]; then
        REGEX_DVB="kernel: \[.*?\] (DVB: registering|input: Sundtek)|$REGEX_DVB"
        echo "  1 = Showing registered DVB adapters (found by kernel)"
    fi

    if [ $(( $LOGLEVEL_DVB & 2 )) == 2 ]; then
        REGEX_DVB="kernel: \[.*?\] (dvb|.*?pctv|.*?stb(6100|0899))|$REGEX_DVB"
        echo "  2 = Showing detailed messages regarding DVB devices found by kernel"
    fi

    #################################################################
    # VDRSXFE
    #################################################################

    if [ $(( $LOGLEVEL_VDRSXFE & 1 )) == 1 ]; then
        REGEX_VDRSXFE="(vdr-sxfe\[.+\]: \[.+\] .*?(failed|error|warning|wait_stream_sync:))"
        echo "  1 = Showing problems with vdr-sxfe frontend"
    fi

    #################################################################
    # BUILD SEARCHSTRING
    #################################################################

    SEARCHSTRING=""

    if [ -n "${REGEX_VDR}" ]; then
        PID="\[[[:digit:]]+\]"
        #cut off last occurence of | (right trim) and wrap in wrapper
        SEARCHSTRING="vdr: $PID (${REGEX_VDR%|})|$SEARCHSTRING"
    fi

    if [ -n "${REGEX_KERNEL}" ]; then
        SEARCHSTRING="${REGEX_KERNEL%|}|$SEARCHSTRING"
    fi

    if [ -n "${REGEX_DVB}" ]; then
        SEARCHSTRING="(${REGEX_DVB%|})|$SEARCHSTRING"
    fi

    if [ -n "${REGEX_VDRSXFE}" ]; then
        SEARCHSTRING="${REGEX_VDRSXFE%|}|$SEARCHSTRING"
    fi

    if [ -n "${REGEX_EXTRAS}" ]; then
        SEARCHSTRING="${REGEX_EXTRAS%|}|$SEARCHSTRING"
    fi


    #cut off last |
    if [ -n SEARCHSTRING ]; then
        SEARCHSTRING=${SEARCHSTRING%|}
    fi

    #todo: still to be implemented
    #REGEX_VDR="(vdr: $PID recording )|(vdr-addon-acpiwakeup: Setting ACPI alarm time to:)|(vdr-shutdown: Shutdown aborted)|)"

#    SEARCHSTRING=""
#HMS="21:(1[4-6]|[4-5][0-9]):.."
#HMS="21:18:.."

#DATE_MONTHDAY="Jul 23"
#HMS="2.:..:.."


    EGREPSTRING="$DATE_MONTHDAY $HMS $HOSTNAME ($SEARCHSTRING)"
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


