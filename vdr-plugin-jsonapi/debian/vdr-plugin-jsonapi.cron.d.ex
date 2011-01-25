#
# Regular cron jobs for the vdr-plugin-jsonapi package
#
0 4	* * *	root	[ -x /usr/bin/vdr-plugin-jsonapi_maintenance ] && /usr/bin/vdr-plugin-jsonapi_maintenance
