#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <syslog.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <linux/uinput.h>
#include <linux/uinput.h>
#include "input_map.h"

#define TRUE 1
#define FALSE 0

#define SOCK_PATH "/dev/lircd"

struct
{
    char *name;
    linux_input_code code;

} input_map[] = {
#include "input_map.inc"
    {NULL, 0}
};

int get_input_code(const char *name, linux_input_code *code)
{
    int i;
    
    for(i=0; input_map[i].name != NULL; i++)
    {
        if(strcasecmp(name, input_map[i].name) == 0)
        {
            *code = input_map[i].code;
            return i;
        }
    }
    return -1;
}

int setup_uinputfd(const char *name)
{
    int fd;
    int key;
    struct uinput_user_dev dev;
    
    fd = open("/dev/input/uinput", O_WRONLY);
    if(fd == -1)
    {
        fd = open("/dev/uinput", O_WRONLY);
        if(fd == -1)
        {
            fd = open("/dev/misc/uinput", O_WRONLY);
            if(fd == -1)
            {
                syslog(LOG_ERR, "could not open uinput: %m");
                return -1;
            }
        }
    }
    memset(&dev, 0, sizeof(dev));
    strncpy(dev.name, name, sizeof(dev.name));
    dev.name[sizeof(dev.name)-1] = 0;
    if (write(fd, &dev, sizeof(dev)) != sizeof(dev) ||
       ioctl(fd, UI_SET_EVBIT, EV_KEY) != 0 ||
       ioctl(fd, UI_SET_EVBIT, EV_REP) != 0) {
        goto setup_error;
    }

    for (key = KEY_RESERVED; key <= KEY_MAX; key++) {
        if(ioctl(fd, UI_SET_KEYBIT, key) != 0)
        {
            goto setup_error;
        }
    }

    if (ioctl(fd, UI_DEV_CREATE) != 0) {
        goto setup_error;
    }
    return fd;
    
 setup_error:
    syslog(LOG_ERR, "could not setup uinput: %m");
    close(fd);
    return -1;
}

int main(int argc, char *argv[])
{
    int s, t, len;
    struct sockaddr_un remote;
    char str[100] = "";
    int ret = 0;
    int uinputfd = -1;
    int reps = 0;
    int btnpressed = FALSE;
    char *saveptr = NULL;
    char *key = NULL;
    char *device = NULL;
    char oldkey[100] = "";
    char olddevice[100] = "";
    struct input_event event;

    uinputfd = setup_uinputfd("lircd");
    if (uinputfd != -1) {
        if ((s = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
            syslog(LOG_ERR, "socket %m");
            exit(1);
        }

        syslog(LOG_ERR, "Trying to connect...");

        remote.sun_family = AF_UNIX;
        strcpy(remote.sun_path, SOCK_PATH);
        len = strlen(remote.sun_path) + sizeof(remote.sun_family);
        if (connect(s, (struct sockaddr *)&remote, len) == -1) {
            syslog(LOG_ERR, "connect(): %m");
            ret = 1;
        }
        else
        {
            struct timeval tv, *tvptr = NULL;

            syslog(LOG_ERR, "Connected.");

            memset(&event, 0, sizeof(event));
            event.type = EV_KEY;

            while (TRUE) {
                fd_set rfds;
                int retval;
                int presskey = FALSE;
                int releasekey = FALSE;

                FD_ZERO(&rfds);
                FD_SET(s, &rfds);

                /* Wait up to 200ms seconds, if button pressed */
                tv.tv_sec = 0;
                tv.tv_usec = 200000;

                if (btnpressed)
                    tvptr = &tv;
                else
                    tvptr = NULL;

                retval = select(s + 1, &rfds, NULL, NULL, tvptr);

                if (retval == -1) {
                    syslog(LOG_ERR, "select() %m");
                    ret = 1;
                    break;
                }
                else if (retval) {
                    int len;
    
                    if  ((len = recv(s, str, sizeof(str), 0)) > 0) {
                        int newbtn = FALSE;
                        strtok_r(str, " ", &saveptr);  
                        reps = atoi(strtok_r(NULL, " ", &saveptr));
                        key = strtok_r(NULL, " ", &saveptr);  
                        device = strtok_r(NULL, " \n", &saveptr);  

                        if (strcmp(oldkey, key) || strcmp(olddevice, device)) {
                            newbtn = TRUE;
                            strcpy(oldkey, key);
                            strcpy(olddevice, device);
                        }

                        if (newbtn)
                            if (btnpressed)
                                releasekey = TRUE;
                            presskey = TRUE;
                    }
                    else if (len < 0) {
                        syslog(LOG_ERR, "select() %m");
                        ret = 1;
                        break;
                    }
                    else {
                        syslog(LOG_INFO, "irserver stopped");
                        break;
                    }
                }
                else {
                    if (btnpressed)
                        releasekey = TRUE;
                    presskey = FALSE;
                }
 
                if (releasekey) {
                    event.value = 0;
                    if (write(uinputfd, &event, sizeof(event)) != sizeof(event)) {
                        syslog(LOG_ERR, "writing to uinput failed");
                        ret = 1;
                        break;
                    }
                    btnpressed = FALSE;
                    releasekey = FALSE;
                }

                if (presskey) {
                    linux_input_code input_code;

                    if (get_input_code(key, &input_code) != -1) {
                        event.code = input_code;
                        event.value = 1;
                        if (write(uinputfd, &event, sizeof(event)) != sizeof(event)) {
                            syslog(LOG_ERR, "writing to uinput failed");
                            ret = 1;
                            break;
                        }
                        btnpressed = TRUE;
                        presskey = FALSE;
                    }
                }
            }
        }
        close(s);
        close(uinputfd);
    }
    return ret;
}
