//sundtek network scan:

#include <stdio.h>
#include <stdlib.h>
#include "sundtek/mcsimple.h"

#include <yavdr/db-utils/dbset.h>
#include <yavdr/db-utils/dbremove.h>

/*
 *
 * Idee für hdf-values
 *
system {
  hardware {
    sundtek {
      enablenetwork = 1         // enable networking
      found {                   // found sundteks at scan time
        0 = 123456
        1 = 1234ds
      }
      123456 {                  // a remote dev
        mode = DVB-C
        info {
          ip = dock
          id = 0
          devicename =
          serial = 123456
          capabilities = 12001
        }
        mount = 1
      }                         // a lokal dev
      1234ds = {
        mode = DVB-S2
        info {
          devicename =
          serial = 123456
          capabilities = 12001
        }
        mount = 1               // will be ignored because of lokal dev
      }
    }
  }
}
 *
 */

#define TRUE 1
#define NETWORK_SCAN_TIME 700

int main() {
	void *obj;
	char *ip=NULL;
	char *id=NULL;
	char *name=NULL;
	char *devid=NULL;
	char *serial=NULL;
	obj = media_scan_network(TRUE, NETWORK_SCAN_TIME);
	uint32_t *cap;
	int n = 0;

	//TODO: Cleanup hdf
	dbremove("system.hardware.sundtek.found");

	// scan network
	media_scan_info(obj, n, "ip", (void**)&ip);
	while (ip != NULL) {
		media_scan_info(obj, n, "serial", (void**)&serial);
		// mark serial as available
		dbset("system.hardware.sundtek.found.%i=%s", n, serial);

		media_scan_info(obj, n, "id", (void**)&id);
		media_scan_info(obj, n, "capabilities", (void**)&cap);
		media_scan_info(obj, n, "devicename", (void**)&name);
		dbset("system.hardware.sundtek.%s.info.ip=%s", serial, ip);
		dbset("system.hardware.sundtek.%s.info.id=%s", serial, id);
		dbset("system.hardware.sundtek.%s.info.devicename=%s", serial, name);
		dbset("system.hardware.sundtek.%s.info.capabilities=%u", serial, cap);
		//dbset("system.hardware.sundtek.%s.info.serial=%s", serial, serial);

		ip=NULL;
		media_scan_info(obj, ++n, "ip", (void**)&ip);
	}
	media_scan_free(&obj);

	// local scan
    int i=0;
    int d=0;
    int fd;
    struct media_device_enum *device;
    fd = net_connect();
    if (fd<0)
    	return fd;

    //while((device=net_device_enum(fd, &i, d))!=0) {  // multi frontend support???
	//	do {
    while((device=net_device_enum(fd, &i, d))!=0) {
		if (device->capabilities & (uint32_t)MEDIA_REMOTE_DEVICE == 0) {
			// mark serial as available
			dbset("system.hardware.sundtek.found.%i=%s", n, device->serial);

			char *dummy;
			if (asprintf(&dummy, "system.hardware.sundtek.%s.info.ip=%s", serial, ip) >= 0)
			{
				dbremove(dummy);
				free(dummy);
			}

			if (asprintf(&dummy, "system.hardware.sundtek.%s.info.id=%s", serial, id) >= 0)
			{
				dbremove(dummy);
				free(dummy);
			}
			dbset("system.hardware.sundtek.%s.info.devicename=%s", device->serial, device->devicename);
			dbset("system.hardware.sundtek.%s.info.capabilities=%u", device->serial, device->capabilities);
			//dbset("system.hardware.sundtek.%s.info.serial=%s", device->serial, device->serial);
		}
		free(device);
//		} while((device=net_device_enum(fd, &i, ++d))!=0);
//		d=0;
		i++;n++;
    }
    net_close(fd);
	return 0;
}
