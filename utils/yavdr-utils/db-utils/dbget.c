#include <fcntl.h>
#include <ClearSilver.h>
#include <stdio.h>
#include "common.h"

int main(int argc, char *argv[])
{
  int ret = 0;
  NEOERR *err;
  HDF *hdf = NULL;
  char *value = NULL;

  err = hdf_init(&hdf);
  if (err != STATUS_OK)
  {
    nerr_log_error(err);
    ret = -1;
  }
  else
  { 
    int fd = 0;

    if ((fd = open(YAVDRDB, O_CREAT|O_WRONLY)) == -1)
    {
      ret = -2;
    }
    else
    {
      flock(fd, LOCK_SH);
      err = hdf_read_file(hdf, YAVDRDB);
      if (err && !nerr_handle(&err, NERR_NOT_FOUND))
      {
        nerr_log_error(err);
        ret = -3;
      }
      else
      {
        value = hdf_get_value(hdf, argv[1], (argc == 3) ? argv[2]: "");
        if (value != NULL)
        {
          fputs(value, stdout);
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
