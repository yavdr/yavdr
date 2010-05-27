#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <dirent.h>
#include <syslog.h>
#include <sys/stat.h> 

#include "common.h"

int scandirfilter(const struct dirent *entry)
{
  return entry->d_name[0] - '.';
}

int main(int argc, char *argv[])
{
  int ret = 0;
  struct dirent **namelist;
  int numcmds;
  int n;
  char *eventdir;
  char *action = NULL;
  char *actioncmd = NULL;
  int i;

  openlog(argv[0], LOG_PID | LOG_CONS, LOG_USER);

  if (argc < 2)
  {
    syslog(LOG_ERR, "usage: %s <event> [argument] ...\n", argv[0]);
    fprintf(stderr, "usage: %s <event> [argument] ...\n", argv[0]);
    ret = -1;
  }
  else
  {
    syslog(LOG_INFO, "processing signal %s", argv[1]);

    if (asprintf(&eventdir, "%s/%s", YAVDREVENTS, argv[1]) < 0)
    {
      syslog(LOG_ERR, "ERROR: asprintf %m");
      ret = -2;
    }
    else
    {
      numcmds = scandir(eventdir, &namelist, scandirfilter, alphasort);
      if (numcmds < 0)
      {
        syslog(LOG_ERR, "ERROR: scandir %m: %s", eventdir);
        ret = -3;
      }
      else
      {
        for (n = 0; n < numcmds; n++)
        {
          if (action)
          {
            free(action);
            action = NULL;
          }

          if (asprintf(&action, "%s/%s", eventdir, namelist[n]->d_name) > 0)
          {
            if (access(action, F_OK | X_OK))
            {
              syslog(LOG_ERR, "ERROR: access %m: %s", action);
              ret = -4;
              continue;
            }
          }
          else
          {
            syslog(LOG_ERR, "ERROR: asprintf %m");
            ret = -5;
          }

          if (asprintf(&actioncmd, "%s %s", action, argv[1]) < 0)
          {
            syslog(LOG_ERR, "ERROR: asprintf %m");
            ret = -6;
          }
          else
          {
            for (i = 2; i < argc; i++)
            {
              if ((actioncmd = realloc(actioncmd, strlen(actioncmd) + strlen(argv[2]) + 2)) == NULL)
              {
                syslog(LOG_ERR, "ERROR: realloc %m");
                ret = -7;
                break;
              }
              else
              {
                 strcat(actioncmd, " ");
                 strcat(actioncmd, argv[i]);
              }
            }
            if (actioncmd != NULL)
            {
              syslog(LOG_INFO, "processing action %s", actioncmd);
              if (system(actioncmd) == -1)
              {
                syslog(LOG_ERR, "ERROR: error processing signal %s", actioncmd);
              }
              free(actioncmd);
            }
          }
          free(namelist[n]);
        }
        if (action)
        {
          free(action);
          action = NULL;
        }

        free(namelist);
      }
      free(eventdir);
    }
  }

  syslog(LOG_INFO, "finished processing signal %s", argc >= 2 ? argv[1] : "");

  closelog();

  return ret;
}
