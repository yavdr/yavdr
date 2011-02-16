//sundtek network scan:

#include <stdio.h>
#include <stdarg.h>
#include <stdlib.h>

#include <sys/socket.h>
#include <sys/ioctl.h>
#include <linux/if.h>
#include <netinet/in.h>
#include <arpa/inet.h>


#include <sundtek/mcsimple.h>

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
          capabilities = 6
        }
        mount = 1
      }                         // a lokal dev
      1234ds = {
        mode = DVB-S2
        info {
          devicename =
          serial = 123456789ABCD
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

char *
trim(char *s) {
	char *end;
	while (isspace(*s)) {
		s++;
	}

	if (*s == 0) // All spaces?
	{
		return s;
	}

	end = s + strlen(s) - 1;
	while (end > s && isspace(*end)) {
		end--;
	}
	// Write new null terminator
	*(end + 1) = 0;

	return s;
}

static int verbose = 0;

static char * dummySerials[] = {
	"123456", // test sample dvb-c/t
	"123456789ABCD",// dumnmy serial for earlier sticks
	NULL
};

int main(int argc, char *argv[]) {
	int c;

	char _serial[100];

	while (1) {
		static struct option long_options[] = {
			/* These options set a flag. */
			{ "verbose", no_argument, &verbose, 1 },
			{ 0, 0, 0, 0 }
		};
		/* getopt_long stores the option index here. */
		int option_index = 0;

		c = getopt_long(argc, argv, "bv", long_options, &option_index);

		/* Detect the end of the options. */
		if (c == -1)
			break;

		switch (c) {
		case 0:
			/* If this option set a flag, do nothing else now. */
			if (long_options[option_index].flag != 0)
				break;
			printf("option %s", long_options[option_index].name);
			if (optarg)
				printf(" with arg %s", optarg);
			printf("\n");
			break;

		case 'v':
			verbose = 1;
			break;

			/*
			 case 'b':
			 puts("option -b\n");
			 break;

			 case 'c':
			 printf("option -c with value `%s'\n", optarg);
			 break;

			 case 'd':
			 printf("option -d with value `%s'\n", optarg);
			 break;

			 case 'f':
			 printf("option -f with value `%s'\n", optarg);
			 break;

			 case '?':
			 /* getopt_long already printed an error message. * /
			 break;

			 default:
			 abort();*/
		}
	}

	struct ifreq *ifr;
	struct ifconf ifc;
	int s, i;
	int numif;

	// find number of interfaces.
	memset(&ifc, 0, sizeof(ifc));
	ifc.ifc_ifcu.ifcu_req = NULL;
	ifc.ifc_len = 0;

	if ((s = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
		perror("socket");
		exit(1);
	}

	if (ioctl(s, SIOCGIFCONF, &ifc) < 0) {
		perror("ioctl");
		exit(2);
	}

	if ((ifr = malloc(ifc.ifc_len)) == NULL) {
		perror("malloc");
		exit(3);
	}
	ifc.ifc_ifcu.ifcu_req = ifr;

	if (ioctl(s, SIOCGIFCONF, &ifc) < 0) {
		perror("ioctl2");
		exit(4);
	}
	close(s);

	numif = ifc.ifc_len / sizeof(struct ifreq);

	void *obj;
	char *ip = NULL;
	char *id = NULL;
	char *name = NULL;
	char *devid = NULL;
	char *serial = NULL;
	int n = 0;

	obj = media_scan_network(TRUE, NETWORK_SCAN_TIME);
	uint32_t *cap;

	//TODO: Cleanup hdf
	dbremove("system.hardware.sundtek.found");

	if (verbose)
		printf("network scan:\n");
	// scan network
	while (media_scan_info(obj, n, "ip", (void**) &ip) == 0) {
		media_scan_info(obj, n, "id", (void**) &id);
		if (verbose)
			printf("\tdevice found at %s:%s - ", ip, id);

		// checking local interfaces
		int isLocal = 0;
		for (i = 0; i < numif; i++) {
			struct ifreq *r = &ifr[i];
			struct sockaddr_in *sin = (struct sockaddr_in *) &r->ifr_addr;

			if (strcmp(ip, inet_ntoa(sin->sin_addr)) == 0) {
				isLocal = 1;
				break;
			}
		}

		if (!isLocal) {
			media_scan_info(obj, n, "capabilities", (void**) &cap);
			if ((*cap & (uint32_t) MEDIA_REMOTE_DEVICE) == 0) { // ignore remote dev
				media_scan_info(obj, n, "serial", (void**) &serial);

				strcpy(_serial, serial);
				trim(_serial);

				// mark serial as available
				dbset("system.hardware.sundtek.found.%i=%s", n, _serial);
				media_scan_info(obj, n, "devicename", (void**) &name);
				if (verbose)
					printf("%s", name);

				dbset("system.hardware.sundtek.%s.info.ip=%s", _serial, ip);
				dbset("system.hardware.sundtek.%s.info.id=%s", _serial, id);
				dbset("system.hardware.sundtek.%s.info.devicename=%s", _serial, name);
				dbset("system.hardware.sundtek.%s.info.capabilities=%i", _serial, *cap);
				//dbset("system.hardware.sundtek.%s.info.serial=%s", serial, serial);

				char *dummy;
				if (asprintf(&dummy, "system.hardware.sundtek.%s.frontend", _serial) >= 0) {
					dbremove(dummy);
					free(dummy);
				}
			} else {
				if (verbose)
					printf("ignored remote mounted device");
			}
		} else {
			if (verbose)
				printf("ignored local device");
		}
		if (verbose)
			printf("\n");

		n++;
	}
	media_scan_free(&obj);
	free(ifr);

	// local scan
	if (verbose)
		printf("\nlocal scan:\n");

	int d = i = 0;
	int fd;
	struct media_device_enum *device;
	fd = net_connect();
	if (fd < 0) {
		if (verbose)
				printf("\tcan't connect to daemon!\n");
		return fd;
	}

	//while((device=net_device_enum(fd, &i, d))!=0) {  // multi frontend support???
	//	do {
	while ((device = net_device_enum(fd, &i, d)) != 0) {
		if (verbose)
			printf("\tdevice found - %s", device->devicename);
		strcpy(_serial, device->serial);
		trim(_serial);
		if ((device->capabilities & (uint32_t) MEDIA_REMOTE_DEVICE) == 0) {
			// mark serial as available
			dbset("system.hardware.sundtek.found.%i=%s", n, _serial);

			char *dummy;
			if (asprintf(&dummy, "system.hardware.sundtek.%s.info.ip", _serial) >= 0) {
				dbremove(dummy);
				free(dummy);
			}

			dbset("system.hardware.sundtek.%s.info.id=%i", _serial, i);
			dbset("system.hardware.sundtek.%s.info.devicename=%s", _serial, device->devicename);
			dbset("system.hardware.sundtek.%s.info.capabilities=%i", _serial, device->capabilities);
			if (asprintf(&dummy, "system.hardware.sundtek.%s.mounted", _serial) >= 0) {
				dbremove(dummy);
				free(dummy);
			}
			//dbset("system.hardware.sundtek.%s.info.serial=%s", device->serial, device->serial);
		} else {
			if (verbose)
				printf(" - mounted device");
			dbset("system.hardware.sundtek.%s.mounted=1", _serial);
		}
		dbset("system.hardware.sundtek.%s.frontend=%s", _serial, device->frontend_node);
		free(device);
		if (verbose)
			printf("\n");

		//	} while((device=net_device_enum(fd, &i, ++d))!=0);
		//	d=0;
		i++;
		n++;
	}
	net_close(fd);
	if (verbose)
		printf("\n");

	return 0;
}
