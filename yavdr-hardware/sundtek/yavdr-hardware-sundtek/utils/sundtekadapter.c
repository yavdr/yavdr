#include <stdio.h>
#include <stdlib.h>

#include <sundtek/mcsimple.h>

//#include "mcsimple.h"
//#include "mediaclient.h"

#define TRUE 1

void help() {
	printf("\n");
	printf("sundtekadapter\n");
	printf("Tool to get information about lokal and remote mounted sundtek adapters\n");
	printf("\n");
	printf("usage:\n");

}

int main(int argc, char *argv[]) {
	int32_t deviceId = -1;
	char serial[100];
	int output = 1;
	int found = 2;
	int c, ignoreremote = 0, remoteonly = 0;

	serial[0] = 0;

	while (1) {
		static struct option long_options[] = {
				/* These options set a flag. */
				{"device", required_argument, 0, 'd'},
				{"serial", required_argument, 0, 's'},
				{"remoteonly", 0, 0, 'r'},
				{"ignoreremote", 0, 0, 'i'},
				{"help", 0, 0, 'h'},
				{ 0, 0, 0, 0 }
		};
		/* getopt_long stores the option index here. */
		int option_index = 0;

		c = getopt_long(argc, argv, "d:o:s:irh?", long_options, &option_index);

		/* Detect the end of the options. */
		if (c == -1)
			break;

		switch (c) {
		case 'd':
			deviceId = strtol(optarg, NULL, 10);
			found = 0;
			break;
		case 'o':
			if (strcmp(optarg, "frontend") == 0) {
				output = 1;
			} else if (strcmp(optarg, "serial") == 0) {
				output = 2;
			} else if (strcmp(optarg, "id") == 0) {
				output = 3;
			} else
				output = 1;
			break;
		case 's':
			strcpy(serial, optarg);
			found = 0;
			break;
		case 'i':
			ignoreremote = 1;
			remoteonly = 0;
			break;
		case 'r':
			ignoreremote = 0;
			remoteonly = 1;
			break;

		case 'h':
		case '?':
			 help();
			 exit(0);
		default:
			 help();
			 exit(1);

		}
	}

	int i = 0;
	int d = 0;
	int fd;
	struct media_device_enum *device;
	fd = net_connect();
	if (fd < 0)
		return fd;

	while ((device = net_device_enum(fd, &i, d)) != 0) {
		do {
			if (device->id == deviceId) {
				found = 1;
			} else if (strcmp(serial, device->serial) == 0) {
				found = 1;
			} else {
				//printf("%u: %s\n", device->id, device->frontend_node);
			}

			if (found > 0 &&
					(remoteonly == 0 || (remoteonly == 1 && (device->capabilities & (uint32_t) MEDIA_REMOTE_DEVICE) != 0)) &&
					(ignoreremote == 0 || (ignoreremote == 1 && (device->capabilities & (uint32_t) MEDIA_REMOTE_DEVICE) == 0))) {
				switch (output) {
				case 1:
					printf("%s\n", device->frontend_node);
					break;
				case 2:
					printf("%s\n", device->serial);
					break;
				case 3:
					printf("%u\n", device->id);
					break;
				}
				if (found == 1) found = 0;
			}
			free(device);
		} while ((device = net_device_enum(fd, &i, ++d)) != 0);
		d = 0;
		i++;
	}
	net_close(fd);

	return 0;
}
