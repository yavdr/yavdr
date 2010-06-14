#include <fcntl.h>
#include <ClearSilver.h>

#include "common.h"

int main(int argc, char *argv[])
{
  int ret = 0;
  NEOERR *err;
  HDF *hdf = NULL;

  err = hdf_init(&hdf);
  if (err != STATUS_OK)
  {
    nerr_log_error(err);
    ret = -1;
  }
  else
  { 
    int fd = 0;

    if ((fd = open(YAVDRDB_LCK, O_CREAT|O_WRONLY)) == -1)
    {
      ret = -2;
    }
    else
    {
      flock(fd, LOCK_EX);
      err = hdf_read_file(hdf, YAVDRDB);
      if (err && !nerr_handle(&err, NERR_NOT_FOUND))
      {
        nerr_log_error(err);
        ret = -3;
      }
      else
      {
        err = hdf_set_valuef(hdf, argv[1]);
        if (err != STATUS_OK)
        {
          nerr_log_error(err);
          ret = -4;
        }
        else
        {
          err = hdf_write_file(hdf, YAVDRDB);
          if (err != STATUS_OK)
          {
            nerr_log_error(err);
            ret = -5;
          }
        }
      }
      flock(fd, LOCK_UN);
      close(fd);
      remove(YAVDRDB_LCK);
    }
    hdf_destroy(&hdf);
  }

  return ret;
}
