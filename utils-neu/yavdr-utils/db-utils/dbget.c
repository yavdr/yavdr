#include <ClearSilver.h>

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
    err = hdf_read_file(hdf, YAVDRDB);
    if (err && !nerr_handle(&err, NERR_NOT_FOUND))
    {
      nerr_log_error(err);
      ret = -2;
    }
    else
    {
      value = hdf_get_value(hdf, argv[1], (argc == 3) ? argv[2]: "");
      if (value != NULL)
      {
        fputs(value, stdout);
      }
    }
    hdf_destroy(&hdf);
  }

  return ret;
}
