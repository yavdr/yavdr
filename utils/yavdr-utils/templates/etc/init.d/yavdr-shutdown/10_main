. /lib/lsb/init-functions

case "$1" in
   stop)
        log_begin_msg "Starting $DESC: $NAME"
        # wait for vdr to finish
        # finally stop rsyslogd (stop disabled to get vdr stop log=
	while pidof vdr &> /dev/null ; do sleep 1 ; done
	/sbin/initctl emit yavdr-shutdown
        log_end_msg $?
        ;;
  *)
        N=/etc/init.d/${0##*/}
        echo "Usage: $N {start|stop}" >&2
        exit 1
        ;;
esac

exit 0

