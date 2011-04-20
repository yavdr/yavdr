#include <stdio.h>
#include <stdarg.h>
#include <stdlib.h>
#include <syslog.h>

#include <sys/socket.h>
#include <sys/ioctl.h>
#include <linux/if.h>
#include <netinet/in.h>
#include <arpa/inet.h>


#include <sundtek/mcsimple.h>

#include <yavdr/db-utils/dbset.h>
#include <yavdr/db-utils/dbremove.h>

static char *dummySerials[] = {
	"123456", // test sample dvb-c/t
	"123456789ABCD",// dumnmy serial for earlier sticks
	NULL
};


static int verbose = 0;
static int attach = -1;


/*
 *
 * Idee für hdf-values
 *
system {
  hardware {
    sundtek {
      enablenetwork = 1  <- aktiviert networking
      stick {
        123456 {
          info {
            ip = 192.x.x.x
            id = 0
            devicename = Sundtek MediaTV Digital Home
            serial = 123456
            capabilities {
              value = 1030
              analog_tv = 0
              dvbt = 1
              dvbc = 1
              radio = 0
              atsc = 0
              remote = 1
              digitalci = 0
              digitalca = 0
              dvbs2 = 0
            }
          }
          mount = 1 <- mounte diese dev, wenn remote gefunden.
        }
      }
      found {
        0 = 123456
      }
      frontend {
        0 = /dev/dvb/adapter0/frontend0
      }
    }
  }
}

 *
 */
#define TRUE 1
#define NETWORK_SCAN_TIME 700

char *trim(char *s) {
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

void convertSerial(char *dst, char *src) {
	strcpy(dst, src);
	trim(dst);
}

int isDummySerial(char *serial) {
	return 1; // disable all the dummy serial handling
	int i = 0;
	int isDummySerial = 0;
	while(dummySerials[i] != NULL) {
		if (strcmp(serial, dummySerials[i]) == 0) {
			isDummySerial = 1;
			break;
		}
		i++;
	}

	return isDummySerial;
}

void capabilities2hdf(uint32_t cap, char* prefix) {
	dbset("%s.info.capabilities.value=%u", prefix, cap);

	dbset("%s.info.capabilities.analog_tv=%i", prefix, (cap & MEDIA_ANALOG_TV) > 0);
	dbset("%s.info.capabilities.dvbt=%i", prefix, (cap & MEDIA_DVBT) > 0);
	dbset("%s.info.capabilities.dvbc=%i", prefix, (cap & MEDIA_DVBC) > 0);
	//dbset("%s.info.capabilities.isdbt=%i", prefix, (cap & MEDIA_ISDBT) > 0);
	//dbset("%s.info.capabilities.audio=%i", prefix, (cap & MEDIA_AUDIO) > 0);
	//dbset("%s.info.capabilities.vbi=%i", prefix, (cap & MEDIA_VBI) > 0);
	dbset("%s.info.capabilities.radio=%i", prefix, (cap & MEDIA_RADIO) > 0);
	dbset("%s.info.capabilities.atsc=%i", prefix, (cap & MEDIA_ATSC) > 0);
	//dbset("%s.info.capabilities.dvrreader=%i", prefix, (cap & MEDIA_DVR_READER) > 0);
	//dbset("%s.info.capabilities.demux=%i", prefix, (cap & MEDIA_DEMUX) > 0);
	dbset("%s.info.capabilities.remote=%i", prefix, (cap & MEDIA_REMOTE) > 0);
	//dbset("%s.info.capabilities.alsad=%i", prefix, (cap & MEDIA_ALSAD) > 0);
	//dbset("%s.info.capabilities.oss=%i", prefix, (cap & MEDIA_OSS) > 0);
	//dbset("%s.info.capabilities.rds=%i", prefix, (cap & MEDIA_RDS) > 0);
	dbset("%s.info.capabilities.digitalci=%i", prefix, (cap & MEDIA_DIGITAL_CI) > 0);
	dbset("%s.info.capabilities.digitalca=%i", prefix, (cap & MEDIA_DIGITAL_CA) > 0);
	dbset("%s.info.capabilities.dvbs2=%i", prefix, (cap & MEDIA_DVBS2) > 0);
}

void writeDevice2HDF(struct media_device_enum *device, int *count) {
	char _serial[100];

	if (verbose) {
		syslog(LOG_ERR, "device found - %s", device->devicename);
		printf("\tdevice found - %s", device->devicename);
	}
	convertSerial(_serial, device->serial);
	if (isDummySerial(_serial) == 1) {
		strcat(_serial, "_127_0_0_1");
	}

	if ((device->capabilities & (uint32_t) MEDIA_REMOTE_DEVICE) == 0) {
		// mark serial as available
		dbset("system.hardware.sundtek.found.%i=%s", (*count)++, _serial);

		char *dummy;
		char *prefix;

		if (asprintf(&prefix, "system.hardware.sundtek.stick.%s", _serial) >= 0) {
			if (asprintf(&dummy, "%s.info.ip", prefix) >= 0) { // a remote dev ist now a lokal on
				dbremove(dummy);
				free(dummy);
			}

			dbset("%s.info.id=%i", prefix, device->id);
			dbset("%s.info.devicename=%s", prefix, device->devicename);

			dbset("%s.info.serial=%s", prefix, device->serial);
			capabilities2hdf(device->capabilities, prefix);

			if (asprintf(&dummy, "%s.mounted", prefix) >= 0) {
				dbremove(dummy);
				free(dummy);
			}

			free(prefix);
		}


		//dbset("system.hardware.sundtek.%s.info.serial=%s", device->serial, device->serial);
	} else {
		if (verbose) {
			syslog(LOG_ERR, "mounted device %s", device->devicename);
			printf(" - mounted device");
		}
		dbset("system.hardware.sundtek.stick.%s.mounted=%i", _serial, device->id);
	}
	dbset("system.hardware.sundtek.frontend.%i=%s", device->id, device->frontend_node);
	free(device);
	if (verbose)
		printf("\n");

}

int main(int argc, char *argv[]) {
	int c;

	char _serial[100];
	int32_t deviceId = -1;

	openlog("scansundtek", LOG_PID | LOG_CONS, LOG_USER);
	syslog(LOG_ERR, "started");

	while (1) {
		static struct option long_options[] = {
			/* These options set a flag. */
			{ "verbose", no_argument, &verbose, 1 },
			{ "attach", no_argument, &attach, 1 },
			{ "detach", no_argument, &attach, 0 },
			{ "device", required_argument, 0, 'd'},
			{ 0, 0, 0, 0 }
		};
		/* getopt_long stores the option index here. */
		int option_index = 0;

		c = getopt_long(argc, argv, "vd:a", long_options, &option_index);

		/* Detect the end of the options. */
		if (c == -1)
			break;

		switch (c) {
		case 'v':
			verbose = 1;
			break;
		case 'd':
			syslog(LOG_ERR, "looking for ID %s\n", optarg);
			deviceId = strtol(optarg, NULL, 10);
			syslog(LOG_ERR, "looking for ID %i\n", deviceId);
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
	int count = 0;

	int d = i = 0;
	int localId = 0;
	int fd;
	struct media_device_enum *device;

	// scan for all devices
	if (deviceId == -1) {
		obj = media_scan_network(TRUE, NETWORK_SCAN_TIME);
		uint32_t *cap;

		//TODO: Cleanup hdf
		dbremove("system.hardware.sundtek.found");
		dbremove("system.hardware.sundtek.frontend");

		if (verbose)
			printf("network scan:\n");
		// scan network
		while (media_scan_info(obj, n, "ip", (void**) &ip) == 0) {
			media_scan_info(obj, n, "id", (void**) &id);
			if (verbose) {
				syslog(LOG_ERR, "\tdevice found at %s:%s - ", ip, id);
				printf("\tdevice found at %s:%s - ", ip, id);
			}
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

					convertSerial(_serial, serial);
					if (isDummySerial(_serial) == 1) {
						strcat(_serial, "_");
						strcat(_serial, ip);

						  unsigned int i = 0;
						  while(_serial[i]) {
							 if (_serial[i] == '.') _serial[i] = '_';
							 i++;
						  }
					}

					// mark serial as available
					dbset("system.hardware.sundtek.found.%i=%s", count++, _serial);
					media_scan_info(obj, n, "devicename", (void**) &name);
					if (verbose) {
						syslog(LOG_ERR, "device found at %s:%s - ", ip, id);
						printf("%s", name);
					}
					char *prefix;
					if (asprintf(&prefix, "system.hardware.sundtek.stick.%s", _serial) >= 0) {
						dbset("%s.info.ip=%s", prefix, ip);
						dbset("%s.info.id=%s", prefix, id);
						dbset("%s.info.devicename=%s", prefix, name);

						dbset("%s.info.serial=%s", prefix, serial);
						capabilities2hdf(*cap, prefix);

						free(prefix);
					}
				} else {
					if (verbose) {
						syslog(LOG_ERR, "ignored remote mounted device");
						printf("ignored remote mounted device");
					}
				}
			} else {
				if (verbose) {
					syslog(LOG_ERR, "ignored local device");
					printf("ignored local device");
				}
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

		fd = net_connect();
		if (fd < 0) {
			if (verbose)
					printf("\tcan't connect to daemon!\n");
			return fd;
		}

		i = 0;
		while((device=net_device_enum(fd, &i, d))!=0) {  // multi frontend support???
			do {
				writeDevice2HDF(device, &count);
			} while((device=net_device_enum(fd, &i, ++d))!=0);
			d=0;
			i++;
			n++;
		}
		net_close(fd);
		if (verbose)
			printf("\n");
	} else {
		if (attach == 1) { // new device is attached

			fd = net_connect();
			if (fd < 0) {
				if (verbose)
						printf("\tcan't connect to daemon!\n");
				return fd;
			}

			while((device=net_device_enum(fd, &i, d))!=0) {  // multi frontend support???
				do {
					if (device->id == deviceId) {
						writeDevice2HDF(device, &count);
					}
				}while((device=net_device_enum(fd, &i, ++d))!=0);
				d=0;
				i++;
				n++;
			}
			net_close(fd);

		} else if (attach == 0) { // device is detached

		}
	}
	return 0;
}
