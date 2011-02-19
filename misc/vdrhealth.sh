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

function init {

    #filename of output file
    OUTPUTFILE="healthreport-`date --rfc-3339=seconds`.txt"

    #hostname of the host the script runs on, is part of every line of the syslog
    HOSTNAME="`hostname`"

    #unused at the moment
    TIMESTAMP="`date +%s`"

    #current day of the current month (= today)
    #DATE_MONTHDAY="`date +"%b %d"`"

    #use this if you are trying to match any day of the current month
    #DATE_MONTHDAY="`date +"%b"` [[:digit:]]+"

    #use this if you are trying to match any day of any month
    DATE_MONTHDAY="... [[:digit:]]+"

    #HOURS MINUTES SECONDS (=HMS)
    HMS="..:..:.."

    #VDR REGEX COLLECTION (SWISS ARMY KNIVE...)

    let COUNT=1

    let VDR_FATAL_EXIT=$COUNT
    VDR_DESCR[ $VDR_FATAL_EXIT ]="Show abnormal VDR shutdowns (bad exit codes, Watchdog PANIC)"
    VDR_REGEX[ $VDR_FATAL_EXIT ]=".*?exiting, exit code [12]|.*?PANIC:"

    let COUNT=$COUNT*2

    let VDR_START=$COUNT
    VDR_DESCR[ $VDR_START ]="Show VDR start messages"
    VDR_REGEX[ $VDR_START ]="VDR version"

    let COUNT=$COUNT*2

    let VDR_STOP=$COUNT
    VDR_DESCR[ $VDR_STOP ]="Show VDR shutdown messages"
    VDR_REGEX[ $VDR_STOP ]=".*?shutdown|.*?Netwatcher thread ended|.*?exiting, exit code 0"

    let COUNT=$COUNT*2

    let VDR_DVB_DEVICE_COUNT=$COUNT
    VDR_DESCR[ $VDR_DVB_DEVICE_COUNT ]="Show number of DVB devices found by VDR on start"
    VDR_REGEX[ $VDR_DVB_DEVICE_COUNT ]="found .+ DVB device"

    let COUNT=$COUNT*2

    let VDR_DVB_DEVICE_COUNT_DYNAMITE=$COUNT
    VDR_DESCR[ $VDR_DVB_DEVICE_COUNT_DYNAMITE ]="Show DVB device changes observed by dynamite plugin"
    VDR_REGEX[ $VDR_DVB_DEVICE_COUNT_DYNAMITE ]="dynamite:"

    let COUNT=$COUNT*2

    let VDR_DVB_DEVICE_DETAILS=$COUNT
    VDR_DESCR[ $VDR_DVB_DEVICE_DETAILS ]="Show details about DVB devices found"
    VDR_REGEX[ $VDR_DVB_DEVICE_DETAILS ]="frontend .+ provides"

    let COUNT=$COUNT*2

    let VDR_FRONTEND_TIMEOUTS=$COUNT
    VDR_DESCR[ $VDR_FRONTEND_TIMEOUTS ]="Show details about frontend timeouts (non-existing channels?)"
    VDR_REGEX[ $VDR_FRONTEND_TIMEOUTS ]="frontend .*? timed out while tuning to channel"

    let COUNT=$COUNT*2

    let VDR_RECORDINGS=$COUNT
    VDR_DESCR[ $VDR_RECORDINGS ]="Show details about recordings"
    VDR_REGEX[ $VDR_RECORDINGS ]=".*?recording"

    let MAX_VDR_ID=$COUNT

    #example: Maximum Loglevel including all stuff, this line should contain ALL options available
    let LOGLEVEL_VDR_MAX=($VDR_FATAL_EXIT + $VDR_START + $VDR_STOP + $VDR_DVB_DEVICE_COUNT + $VDR_DVB_DEVICE_COUNT_DYNAMITE + $VDR_DVB_DEVICE_DETAILS + $VDR_FRONTEND_TIMEOUTS + $VDR_RECORDINGS)

    #useful example setting
    let LOGLEVEL_VDR=($VDR_FATAL_EXIT + $VDR_START + $VDR_STOP + $VDR_DVB_DEVICE_COUNT + $VDR_DVB_DEVICE_COUNT_DYNAMITE + $VDR_DVB_DEVICE_DETAILS)
    LOGLEVEL_KERNEL=3
    LOGLEVEL_DVB=1
    LOGLEVEL_VDRSXFE=0

    ##only detect vdr crashes
    #let LOGLEVEL_VDR=$VDR_FATAL_EXIT
    #LOGLEVEL_KERNEL=0
    #LOGLEVEL_DVB=0
    #LOGLEVEL_VDRSXFE=0
}

function createRegex {

    REGEX_VDR=""
    REGEX_KERNEL=""
    REGEX_DVB=""
    REGEX_VDRSXFE=""
    REGEX_EXTRAS=""

    #################################################################
    # KERNEL (Boot/Shutdown)
    #################################################################

    FLAG=" "
    if [ $(( $LOGLEVEL_KERNEL & 1 )) == 1 ]; then
        REGEX_KERNEL="(kernel: imklog .*? log source .*? started\.)|$REGEX_KERNEL"
        FLAG="X"
    fi
    echo "KRNL: [$FLAG] Show indications when machine was starting up (1)"

    FLAG=" "
    if [ $(( $LOGLEVEL_KERNEL & 2 )) == 2 ]; then
        REGEX_KERNEL="(kernel: Kernel logging \(proc\) stopped\.)|$REGEX_KERNEL"
        FLAG="X"
    fi
    echo "KRNL: [$FLAG] Show indications when machine was shutting down (2)"

    #################################################################
    # DVB
    #################################################################

    FLAG=" "
    if [ $(( $LOGLEVEL_DVB & 1 )) == 1 ]; then
        REGEX_DVB="kernel: \[.*?\] (DVB: registering|input: Sundtek)|$REGEX_DVB"
        FLAG="X"
    fi
    echo "DVB:  [$FLAG] Show registered DVB adapters (found by kernel) (1)"

    FLAG=" "
    if [ $(( $LOGLEVEL_DVB & 2 )) == 2 ]; then
        REGEX_DVB="kernel: \[.*?\] (dvb|.*?pctv|.*?stb(6100|0899))|$REGEX_DVB"
        FLAG="X"
    fi
    echo "DVB:  [$FLAG] Show detailed messages regarding DVB devices found by kernel (2)"

    #################################################################
    # BUILD VDR REGEX STRING
    #################################################################

    COUNT=1
    until [ $COUNT -gt ${MAX_VDR_ID} ]; do
        if [ $(( $LOGLEVEL_VDR & $COUNT )) == $COUNT ]; then
            if [ $COUNT > 1 ]; then
                REGEX_VDR="${VDR_REGEX[$COUNT]}|$REGEX_VDR"
            else
                REGEX_VDR="${VDR_REGEX[$COUNT]}"
            fi
            echo "VDR:  [X] ${VDR_DESCR[$COUNT]} ($COUNT)"
        else
            echo "VDR:  [ ] ${VDR_DESCR[$COUNT]} ($COUNT)"
        fi
        let COUNT=$COUNT*2
    done

    #################################################################
    # VDRSXFE
    #################################################################

    FLAG=" "
    if [ $(( $LOGLEVEL_VDRSXFE & 1 )) == 1 ]; then
        REGEX_VDRSXFE="(vdr-sxfe\[.+\]: \[.+\] .*?(failed|error|warning|wait_stream_sync:))"
        FLAG="X"
    fi
    echo "SXFE: [$FLAG] Show problems with vdr-sxfe frontend (1)"

    #################################################################
    # EXTRAS
    #################################################################

    FLAG=" "
    if [ $(( $LOGLEVEL_VDR & $VDR_STOP )) == $VDR_STOP ]; then
        REGEX_EXTRAS="(init: vdr main process (.*?) killed)|"
        FLAG="X"
    fi
    echo "MISC: [$FLAG] Show when VDR process was killed by a signal (TERM/KILL)"


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


    #DEBUG STUFF
    #    SEARCHSTRING=""
    #HMS="21:(1[4-6]|[4-5][0-9]):.."
    #HMS="21:18:.."
    #DATE_MONTHDAY="Jul 23"
    #HMS="2.:..:.."

    EGREPSTRING="$DATE_MONTHDAY $HMS $HOSTNAME ($SEARCHSTRING)"

#    echo "GrepString: $EGREPSTRING"
#    echo "Loglevels: VDR=$LOGLEVEL_VDR KRNL=$LOGLEVEL_KERNEL DVB=$LOGLEVEL_DVB SXFE=$LOGLEVEL_VDRSXFE"
    #echo -------------------------------------------------------------
}

function grepIt {
    LOGFILE=$1
    if [ ".gz" == "${LOGFILE:(-3)}" ]; then
        #Detected gz file, using zegrep.
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

     $GREPCMD -i "$EGREPSTRING" $LOGFILE >> "$OUTPUTFILE"
#    $GREPCMD -iHn "$EGREPSTRING" $LOGFILE
}

function main {

    echo "*****************************************************************"
    echo "VDRHealth - This script is part of the yaVDR project"
    echo "*****************************************************************"
    echo "Current configuration:"
    init
    createRegex
    echo "*****************************************************************"
    echo "Output file: $OUTPUTFILE"
    echo "*****************************************************************"
    echo "Please wait... (this can take a while)"
    #exit
    if [ -e /var/log/syslog.7.gz ]; then
        grepIt "/var/log/syslog.7.gz"
    fi
    if [ -e /var/log/syslog.6.gz ]; then
        grepIt "/var/log/syslog.6.gz"
    fi
    if [ -e /var/log/syslog.5.gz ]; then
        grepIt "/var/log/syslog.5.gz"
    fi
    if [ -e /var/log/syslog.4.gz ]; then
        grepIt "/var/log/syslog.4.gz"
    fi
    if [ -e /var/log/syslog.3.gz ]; then
        grepIt "/var/log/syslog.3.gz"
    fi
    if [ -e /var/log/syslog.2.gz ]; then
        grepIt "/var/log/syslog.2.gz"
    fi
    if [ -e /var/log/syslog.1 ]; then
        grepIt "/var/log/syslog.1"
    fi
    grepIt "/var/log/syslog"
    echo "*****************************************************************"
    echo "You will find the output of this script in the file $OUTPUTFILE in the current folder."
}

main