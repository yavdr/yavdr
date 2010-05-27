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
    err = hdf_read_file(hdf, YAVDRDB);
    if (err && !nerr_handle(&err, NERR_NOT_FOUND))
    {
      nerr_log_error(err);
      ret = -2;
    }
    else
    {
      err = hdf_set_valuef(hdf, argv[1]);
      if (err != STATUS_OK)
      {
        nerr_log_error(err);
        ret = -3;
      }
      else
      {
        err = hdf_write_file(hdf, YAVDRDB);
        if (err != STATUS_OK)
        {
          nerr_log_error(err);
          ret = -4;
        }
      }
    }
    hdf_destroy(&hdf);
  }

  return ret;
}
