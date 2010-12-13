#!/bin/sh

process-template --mode 775 /etc/init.d/force-fsck
process-template --mode 775 /etc/init.d/yavdr-shutdown

# Symlinks erstellen, die beim Shutdown ausgeführt werden:
ln -sf /etc/init.d/force-fsck /etc/rc0.d/S61force-fschk
ln -sf /etc/init.d/force-fsck /etc/rc6.d/S61force-fschk
ln -sf /etc/init.d/yavdr-shutdown /etc/rc0.d/S59yavdr-shutdown
ln -sf /etc/init.d/yavdr-shutdown /etc/rc6.d/S59yavdr-shutdown

rm -f /etc/rc6.d/S61force-fchk
rm -f /etc/rc0.d/S61force-fchk
