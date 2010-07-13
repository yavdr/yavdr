#!/bin/bash
HOSTNAME="`hostname`"
TIMESTAMP="`date +%s`"
#current day of the current month (= today)
DATE_MONTHDAY="`date +"%b %d"`"
#trying to match any day of the current month
DATE_MONTHDAY="`date +"%b"` .+"
TRIGGERSTRING=""
#echo Hostname is $HOSTNAME / $DATE_MONTHDAY


function grepIt {
    LOGFILE=$1
    PID="\[[[:digit:]]+\]"
    REGEX_DVB="kernel: \[.*?\] (dvb|.*?pctv|.*?stb(6100|0899)|input: (Sundtek|IR-))"
    REGEX_KERNEL_ONBOOT="kernel: imklog 4\.2\.0\, log source \= \/proc\/kmsg started\."
    REGEX_KERNEL_ONSHUTDOWN="kernel: Kernel logging \(proc\) stopped\."
    REGEX_VDR="(vdr: $PID (.*?exiting, exit code|.*?PANIC:|VDR version|.*?shutdown|found .+ DVB devices|frontend .+ provides|recording ))|(vdr-addon-acpiwakeup: Setting ACPI alarm time to:)|(vdr-shutdown: Shutdown aborted)|(vdr-sxfe\[.+\]: \[.+\] .*?(failed|error|warning))"
    SEARCHSTRING="($REGEX_DVB)|($REGEX_VDR)|($REGEX_KERNEL_ONSHUTDOWN)|($REGEX_KERNEL_ONBOOT)"
    #|(.+: .*?(failed|error|problem))"
    #only panics
    #SEARCHSTRING="(vdr: $PID (.*?exiting, exit code 2|.*?PANIC:))"

    #echo Extension: \"${LOGFILE:(-3)}\"
    if [ ".gz" = "${LOGFILE:(-3)}" ]; then
        #echo "Detected gz file, using zegrep."
        GREPCMD="zegrep"
        FIRSTLINE="not read because zipped"
        LASTLINE="not read because zipped"
        BEGIN="?"
        END="?"
    else
        GREPCMD="egrep"
        FIRSTLINE="`head -n 1 $LOGFILE`"
        LASTLINE="`tail -n 1 $LOGFILE`"
        BEGIN=${FIRSTLINE:0:15}
        END=${LASTLINE:0:15}

    fi
    EGREPSTRING="$DATE_MONTHDAY ..:..:.. $HOSTNAME $SEARCHSTRING"
    echo -------------------------------------------------------------
    echo Examining file: $LOGFILE \(Timespan: $BEGIN - $END\)
    #echo GrepString: "$EGREPSTRING"
    echo -------------------------------------------------------------
    $GREPCMD -i "$EGREPSTRING" $LOGFILE
    echo -------------------------------------------------------------
}

echo "*****************************************************************"
#grepIt "/var/log/syslog.7.gz"
#grepIt "/var/log/syslog.6.gz"
#grepIt "/var/log/syslog.5.gz"
#grepIt "/var/log/syslog.4.gz"
#grepIt "/var/log/syslog.3.gz"
#grepIt "/var/log/syslog.2.gz"
grepIt "/var/log/syslog.1"
grepIt "/var/log/syslog"

#TRIGGERSTRING=
#PROCESSNAME=


