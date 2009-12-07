#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>

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
  char *eventcmd;
  int i;

  if (argc < 2)
  {
    fprintf(stderr, "usage: %s <event> [argument] ...\n", argv[0]);
    ret = -1;
  }
  else
  {
    if (asprintf(&eventdir, "%s/%s", YAVDREVENTS, argv[1]) < 0)
    {
      perror("asprintf");
      ret = -2;
    }
    else
    {
      numcmds = scandir(eventdir, &namelist, scandirfilter, alphasort);
      if (numcmds < 0)
      {
        perror("scandir");
        ret = -3;
      }
      else
      {
        for (n = 0; n < numcmds; n++)
        {
          if (asprintf(&eventcmd, "%s/%s %s", eventdir, namelist[n]->d_name, argv[1]) < 0)
          {
            perror("asprintf");
            ret = -4;
          }
          else
          {
            for (i = 2; i < argc; i++)
            {
              if ((eventcmd = realloc(eventcmd, strlen(eventcmd) + strlen(argv[2]) + 2)) == NULL)
              {
                perror("realloc");
                ret = -5;
                break;
              }
              else
              {
                 strcat(eventcmd, " ");
                 strcat(eventcmd, argv[i]);
              }
            }
            if (eventcmd != NULL)
            {
              system(eventcmd);
              free(eventcmd);
            }
          }
          free(namelist[n]);
        }
        free(namelist);
      }
      free(eventdir);
    }
  }

  return ret;
}
