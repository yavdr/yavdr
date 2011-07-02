#
# VDR Recording Action Script  - Steffen Barszus <steffenbpunkt@gmail.com>
# ---------------------------
#
# This script gets executed by VDR before a recording starts, after a
# recording ends and after a recording has been edited.
# In order to allow other addons to hook into this process, this script will
# search for any executables in /usr/share/vdr/recording-hooks. These
# hooks are called in their alphabetical order and should follow this
# naming scheme:
#
# R<XX>.<identifier>
#
# Where <XX> is a two digit number, that mainly specifies the execution order
# and <identifier> is a unique descriptor.
#
# Two parameters are passed to each recording hook:
#
# Parameter 1 can have the values "before", "after" and "edited", depending
# on whether the recording hook is called before the recording starts,
# after the recording ends or after the recording has been edited.
#
# Parameter 2 is the directory of the recording. Be aware, that this directory
# doesn't exist before the recording starts.
#
# all hooks are executed with at, as they are called from vdr main loop and
# vdr would be killed by watchdog if they take longer
#

REC_HOOKS_DIR=/usr/share/vdr/recording-hooks

recordinghooks=`find $REC_HOOKS_DIR -maxdepth 1 -xtype f | sort`

for recordinghook in $recordinghooks; do
    logger -t recordingaction "executing $recordinghook $action"
    echo "$recordinghook $* &> /dev/null" | at now
done

