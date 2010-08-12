#!/bin/sh

process-template --mode 775 /etc/init.d/force-fsck

# Symlinks erstellen, die beim Shutdown ausgeführt werden:
ln -sf /etc/init.d/force-fsck /etc/rc0.d/S61force-fschk
ln -sf /etc/init.d/force-fsck /etc/rc6.d/S61force-fschk
