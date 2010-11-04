#include <fcntl.h>
#include <ClearSilver.h>
#include "common.h"
#include "dbset.h"

static int _dbset(const char *fmt, va_list ap)
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

    if ((fd = open(YAVDRDB, O_WRONLY)) == -1)
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
        err = hdf_set_valuevf(hdf, fmt, ap);
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
      //remove(YAVDRDB_LCK);
    }
    hdf_destroy(&hdf);
  }

  return ret;
}

int dbset(const char *fmt, ...)                                                                 
{                                                                                                                       
  int ret;
  va_list ap;                                                                                                           
                                                                                                                        
  va_start(ap, fmt);                                                                                                    
  ret = _dbset(fmt, ap);                                                                                  
  va_end(ap);                                                                                                           
  return ret;                                                                                                
}          
