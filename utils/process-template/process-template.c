#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <dirent.h>
#include <errno.h>
#include <ClearSilver/ClearSilver.h>

#include "common.h"
#include "../common/make_dirs.h"

#define BACKUPCMD "[ -f %s ] && mkdir -p %s%s && cp %s %s%s/$(date +%%Y%%m%%d%%H%%M%%S)"

NEOERR *csoutfunc(void *ctx, char *str)
{
  fputs(str, (FILE *)ctx);   
  return STATUS_OK;
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

int write_segment(int templatefd, char *segmentname) 
{
  int readlen;
  char buffer[1024];
  int ret = 0;
  int segmentfd = 0;

  if ((segmentfd = open(segmentname, O_RDONLY)) < 0)
  {
    fprintf(stderr, "error: %s opening %s\n", strerror(errno), segmentname);
    ret = -1;
  }
  else
  {
    while ((readlen = read(segmentfd, buffer, sizeof(buffer))) > 0)
    {
      write(templatefd, buffer, readlen);
    }
    close(segmentfd);
  }
  return ret;
}

int merge_template(char *template)
{
  struct dirent **namelist;
  struct dirent **namelistcustom;
  int numtemps;
  int numcustomtemps;
  int n, m, comp;
  char *templatedir;
  char *templatecustomdir;
  char templatename[] = "/tmp/template.XXXXXX";
  int templatefd = 0;
  char *segmentname;
  char *backupcmd;
  int ret = 0;
 
  if (asprintf(&templatedir, "%s/%s", TEMPLATEPATH, template) < 0)
  {
    fprintf(stderr, "error: %s asprintf\n", strerror(errno));
    ret = -1;
  }
  else
  {  
    numtemps = scandir(templatedir, &namelist, scandirfilter, alphasort);

    if (numtemps < 0)
    {
      fprintf(stderr, "error: %s scandir %s\n", strerror(errno), templatedir);
      ret = -2;
    }
    else
    {
      if (asprintf(&templatecustomdir, "%s/%s", TEMPLATECUSTOMPATH, template) < 0)
      {
        fprintf(stderr, "error: %s asprintf\n", strerror(errno));
        ret = -3;
      }
      else
      {  
        numcustomtemps = scandir(templatecustomdir, &namelistcustom, scandirfilter, alphasort);

        if (numcustomtemps < 0)
        {
          numcustomtemps = 0;
        }

        if ((templatefd = mkstemp(templatename)) < 0)
        {
          fprintf(stderr, "error: %s mkstemp\n", strerror(errno));
          ret = -5;
        }
        else
        {
          for (n = 0, m = 0; n < numtemps; n++)
          {
            comp = 1;

            while ((ret == 0) && (m < numcustomtemps) && 
                   ((comp = strcmp(namelist[n]->d_name, namelistcustom[m]->d_name)) >= 0))
            {
              if (asprintf(&segmentname, "%s/%s", templatecustomdir, namelistcustom[m]->d_name) < 0)
              {
                fprintf(stderr, "error: %s asprintf\n", strerror(errno));
                ret = -6;
              }
              else
              {
                if (write_segment(templatefd, segmentname))
                {
                  ret = -7;
                }
                free(segmentname);
              }
              free(namelistcustom[m++]);

              if (comp == 0)
              {
                break;
              }
            }
            if (comp != 0)
            {
              if (asprintf(&segmentname, "%s/%s", templatedir, namelist[n]->d_name) < 0)
              {
                fprintf(stderr, "error: %s asprintf\n", strerror(errno));
                ret = -8;
              }
              else
              {
                if (write_segment(templatefd, segmentname))
                {
                  ret = -9;
                }
                free(segmentname);
              }
            }
            free(namelist[n]);
          }
          free(namelist);
      
          while ((ret == 0) && (m < numcustomtemps))
          {
            if (asprintf(&segmentname, "%s/%s", templatecustomdir, namelistcustom[m]->d_name) < 0)
            {
              fprintf(stderr, "error: %s asprintf\n", strerror(errno));
              ret = -10;
            }
            else
            {
              if (write_segment(templatefd, segmentname))
              {
                ret = -11;
              }
              free(segmentname);
            }
            free(namelistcustom[m++]);
          }

          if (numcustomtemps > 0)
          {
            free(namelistcustom);
          }

          if (templatefd > 0)
          {
            close(templatefd);
          }
        }
        free(templatedir);

        if (ret == 0)
        {
          if (asprintf(&backupcmd, BACKUPCMD, 
               template,                          // [ -f %s ] && 
               PRCTMPLBACKDIR,template, 	  // mkdir -p %s%s && 
               template, PRCTMPLBACKDIR, template // cp %s %s%s/
              ) < 0)
          {
            fprintf(stderr, "error: %s asprintf\n", strerror(errno));
            ret = -12;
          }
          else
          {
            if (system(backupcmd) < 0)
            {
              fprintf(stderr, "error: %s system\n", strerror(errno));
              ret = -13;
            }
            else
            { 
              if (process_template(templatename, template) < 0)
              {
                ret = -14;
              }
            }
            free(backupcmd);
          }
        }
      }
    }  
  }  
  return ret;
}


int main(int argc, char *argv[])
{
  int ret = 0;

  ret = merge_template(argv[1]);
  
  return ret;
}
