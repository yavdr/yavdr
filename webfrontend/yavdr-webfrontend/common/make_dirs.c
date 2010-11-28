#include <string.h>
#include <fcntl.h>
#include <sys/types.h>                                                                                           
#include <sys/stat.h>                                                                                            
#include <unistd.h> 
#include <stdlib.h> 
#include <yavdr/make_dirs.h>

int make_dirs(const char *FileName)
{
  int result = 1;
  char *s = strdup(FileName);
  char *p = s;
  if (*p == '/')
    p++;
  while ((p = strchr(p, '/')) != NULL)
  {
    struct stat fs;
    if (p)
      *p = 0;
    if (stat(s, &fs) != 0 || !S_ISDIR(fs.st_mode))
    {
      if (mkdir(s, ACCESSPERMS) == -1)
      {
        perror(s);
        result = 0;
        break;
      }
    }
    if (p)
      *p++ = '/';
    else
      break;
  }
  free(s);
  return result;
}
