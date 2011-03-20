#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include <X11/Xlib.h>

#include "nv-control-screen.h"

#include "NVCtrl/NVCtrl.h"
#include "NVCtrl/NVCtrlLib.h"


static char *display_device_name(int mask);

#include <yavdr/db-utils/dbset.h>
#include <yavdr/db-utils/dbremove.h>

#include <yavdr/common.h>

/*
  x11 {
    dualhead {
      enabled = 0
    }
    display {
      default = DFP-1
      0 {
        device = DFP-1
        mode {
          0 = 1920x1080
          1 = 1920x1080_24
          2 = 1920x1080_50
        }
        default = 1920x1080_50
        overscan =
      }
    }
  }
 */


int main(int argc, char *argv[])
{
    Display *dpy;
    Bool ret;
    int screen, display_devices, mask, major, minor;
    char *str;
    int nDisplayDevice;


    /*
* Open a display connection, and make sure the NV-CONTROL X
* extension is present on the screen we want to use.
*/

    dpy = XOpenDisplay(NULL);
    if (!dpy) {
        fprintf(stderr, "Cannot open display '%s'.\n\n", XDisplayName(NULL));
        return 1;
    }

    screen = GetNvXScreen(dpy);

    ret = XNVCTRLQueryVersion(dpy, &major, &minor);
    if (ret != True) {
        fprintf(stderr, "The NV-CONTROL X extension does not exist on '%s'.\n\n", XDisplayName(NULL));
        return 1;
    }

    /*
	* query the connected display devices on this X screen and print
	* basic information about each X screen
	*/

    ret = XNVCTRLQueryAttribute(dpy, screen, 0,
                                NV_CTRL_CONNECTED_DISPLAYS, &display_devices);

    if (!ret) {
        fprintf(stderr, "Failed to query the enabled Display Devices.\n\n");
        return 1;
    }

    nDisplayDevice = 0;
    for (mask = 1; mask < (1 << 24); mask <<= 1) {
        if (display_devices & mask) {
            XNVCTRLQueryStringAttribute(dpy, screen, mask,
                                        NV_CTRL_STRING_DISPLAY_DEVICE_NAME,
                                        &str);

            dbset("system.x11.display.%i.device=%s" , nDisplayDevice, display_device_name(mask));
            dbset("system.x11.display.%i.mode.0=nvidia-auto-select", nDisplayDevice);
            dbset("system.x11.display.%i.default=nvidia-auto-select", nDisplayDevice);

            printf("%i:%s:0x%08x:%s\n", nDisplayDevice, display_device_name(mask), mask, str);

            nDisplayDevice++;
        }
    }

    if (nDisplayDevice > 1) { // more than one screen found
    	dbset("system.x11.dualhead.enabled=1");
    } else {
    	dbset("system.x11.dualhead.enabled=0");
    }

    char *dummy;
    for (; nDisplayDevice <= 3; nDisplayDevice++) {
    	if (asprintf(&dummy, "system.x11.display.%i", nDisplayDevice) >= 0) {
    		dbremove(dummy);
    		free(dummy);
    	}
    }

    return 0;
}

/*****************************************************************************/
/* utility functions */
/*****************************************************************************/


/*
* display_device_name() - return the display device name correspoding
* to the specified display device mask.
*/

static char *display_device_name(int mask)
{
    switch (mask) {
    case (1 << 0): return "CRT-0"; break;
    case (1 << 1): return "CRT-1"; break;
    case (1 << 2): return "CRT-2"; break;
    case (1 << 3): return "CRT-3"; break;
    case (1 << 4): return "CRT-4"; break;
    case (1 << 5): return "CRT-5"; break;
    case (1 << 6): return "CRT-6"; break;
    case (1 << 7): return "CRT-7"; break;

    case (1 << 8): return "TV-0"; break;
    case (1 << 9): return "TV-1"; break;
    case (1 << 10): return "TV-2"; break;
    case (1 << 11): return "TV-3"; break;
    case (1 << 12): return "TV-4"; break;
    case (1 << 13): return "TV-5"; break;
    case (1 << 14): return "TV-6"; break;
    case (1 << 15): return "TV-7"; break;

    case (1 << 16): return "DFP-0"; break;
    case (1 << 17): return "DFP-1"; break;
    case (1 << 18): return "DFP-2"; break;
    case (1 << 19): return "DFP-3"; break;
    case (1 << 20): return "DFP-4"; break;
    case (1 << 21): return "DFP-5"; break;
    case (1 << 22): return "DFP-6"; break;
    case (1 << 23): return "DFP-7"; break;
    default: return "Unknown";
    }

} /* display_device_name() */
