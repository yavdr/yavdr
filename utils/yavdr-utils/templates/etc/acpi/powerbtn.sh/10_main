# /etc/acpi/powerbtn.sh
# Initiates a shutdown when the power putton has been
# pressed.

# Skip if we just in the middle of resuming.
test -f /var/lock/acpisleep && exit 0

# If gnome-power-manager or kded4 are running, let
# them handle policy This is effectively the same as 'acpi-support's
# '/usr/share/acpi-support/policy-funcs' file.

if pidof gnome-power-manager kded4 > /dev/null; then
    exit
fi

if [ "0$(cat /tmp/powerbtn 2>/dev/null)" -lt "0$(($(date +%s)-1))" ]; then
  date +%s > /tmp/powerbtn
  /usr/bin/vdr-dbus-send /Remote remote.HitKey string:'Power'
  exit
fi

# If all else failed, just initiate a plain shutdown.
<?cs if:(system.shutdown == "reboot") ?>
/usr/sbin/grub-reboot PowerOff; /sbin/reboot
<?cs else ?>
/sbin/shutdown -h now "Power button pressed"
<?cs /if ?>

