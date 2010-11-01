#include <fcntl.h>
#include <ClearSilver.h>
#include <stdio.h>
#include <string.h>
#include "common.h"
#include "dbget.h"

char *dbget(char *name, char *defval)
{
  char *ret = NULL;
  NEOERR *err;
  HDF *hdf = NULL;
  char *value = NULL;

  err = hdf_init(&hdf);
  if (err != STATUS_OK)
  {
    nerr_log_error(err);
  }
  else
  { 
    int fd = 0;

    if ((fd = open(YAVDRDB, O_RDONLY)) != -1)
    {
      flock(fd, LOCK_SH);
      err = hdf_read_file(hdf, YAVDRDB);
      if (err && !nerr_handle(&err, NERR_NOT_FOUND))
      {
        nerr_log_error(err);
      }
      else
      {
        value = hdf_get_value(hdf, name, defval);
        if (value != NULL)
        {
          ret = strdup(value);
        }
      }
      flock(fd, LOCK_UN);
      close(fd);
      //remove(YAVDRDB_LCK);
    }
    hdf_destroy(&hdf);
  }

  return ret;
}
