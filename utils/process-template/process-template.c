#include <string.h>
#include <fcntl.h>
#include <dirent.h>
#include <ClearSilver/ClearSilver.h>

#include "common.h"

NEOERR *csoutfunc(void *ctx, char *str)
{
  fputs(str, (FILE *)ctx);   
  return STATUS_OK;
}

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

int process_template(char *infile, char *outfile)
{
  int ret = 0;
  FILE *outfh = NULL;
  NEOERR *err;
  HDF *hdf = NULL;
  CSPARSE *parse = NULL;

  if (!make_dirs(outfile))
  {
    ret = -1;
  }
  else
  {
    if ((outfh = fopen(outfile, "w")) == NULL)
    {
      perror("fopen");
      ret = -2;
    }
    else
    {
      err = hdf_init(&hdf);
      if (err != STATUS_OK)
      {
        nerr_log_error(err);
        ret = -3;
      }
      else
      { 
        err = hdf_read_file(hdf, YAVDRDB);
        if (err != STATUS_OK)
        {
          nerr_log_error(err);
          ret = -4;
        }
        else
        {
          err = cs_init(&parse, hdf);
          if (err != STATUS_OK)
          {
            nerr_log_error(err);
            ret = -5;
          }
          else
          { 
            err = cs_parse_file(parse, infile);
            if (err != STATUS_OK)
            {
              nerr_log_error(err);
              ret = -6;
            }
        
            err = cs_render(parse, outfh, csoutfunc);  
            if (err != STATUS_OK)
            {
              nerr_log_error(err);
              ret = -7;
            }

            cs_destroy(&parse);
          }
        }
        hdf_destroy(&hdf);
      }
      fclose(outfh);
    }
  }
  return ret;
}

int scandirfilter(const struct dirent *entry)
{
  return entry->d_name[0] - '.';
}

int main(int argc, char *argv[])
{
  struct dirent **namelist;
  int numtemps;
  int n;
  char *templatedir;
  char templatename[] = "/tmp/template.XXXXXX";
  int templatefd = 0;
  char *segmentname;
  int segmentfd = 0;
  int ret = 0;
  int readlen;
  char buffer[1024];
 
  if (asprintf(&templatedir, "%s/%s", TEMPLATEPATH, argv[1]) < 0)
  {
    perror("asprintf");
    ret = -1;
  }
  else
  {  
    numtemps = scandir(templatedir, &namelist, scandirfilter, alphasort);

    if (numtemps < 0)
    {
      perror("scandir");
      ret = -2;
    }
    else
    {
      if ((templatefd = mkstemp(templatename)) < 0)
      {
        perror("mkstemp");
        ret = -3;
      }
   
      for (n = 0; n < numtemps; n++)
      {
        if (asprintf(&segmentname, "%s/%s", templatedir, namelist[n]->d_name) < 0)
        {
          perror("asprintf");
          ret = -4;
        }
        else
        {
          if ((segmentfd = open(segmentname, O_RDONLY)) < 0)
          {
            perror("open");
            ret = -5;
          }
          else
          {
            while ((readlen = read(segmentfd, buffer, sizeof(buffer))) > 0)
            {
              write(templatefd, buffer, readlen);
            }
            close(segmentfd);
          }
          free(segmentname);
        }
        free(namelist[n]);
      }
      free(namelist);
      
      if (templatefd > 0)
      {
        close(templatefd);
      }
    }
    free(templatedir);

    if (ret ==0)
    {
      if (process_template(templatename, argv[1]) < 0)
      {
        ret = -6;
      }
    }  
  }  
  return ret;
}
