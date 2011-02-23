#include <stdio.h>
#include <stdlib.h>

#include <sundtek/mcsimple.h>

//#include "mcsimple.h"
//#include "mediaclient.h"

#define TRUE 1

int main(int argc, char *argv[]) {
	int32_t deviceId = -1;
	int c;

	while (1) {
		static struct option long_options[] = {
				/* These options set a flag. */
				{"device", required_argument, 0, 'd'},
				{ 0, 0, 0, 0 }
		};
		/* getopt_long stores the option index here. */
		int option_index = 0;

		c = getopt_long(argc, argv, "d:", long_options, &option_index);

		/* Detect the end of the options. */
		if (c == -1)
			break;

		switch (c) {
		case 'd':
			deviceId = strtol(optarg, NULL, 10);
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

	int i = 0;
	int d = 0;
	int fd;
	struct media_device_enum *device;
	fd = net_connect();
	if (fd < 0)
		return fd;

	while ((device = net_device_enum(fd, &i, d)) != 0) {
		do {
			if (deviceId >= 0) {
				if (device->id == deviceId) {
					printf("%s\n", device->frontend_node);
				}
			} else {
				printf("%u: %s\n", device->id, device->frontend_node);
			}
			free(device);
		} while ((device = net_device_enum(fd, &i, ++d)) != 0);
		d = 0;
		i++;
	}
	net_close(fd);

	return 0;
}
