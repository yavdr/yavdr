#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <dirent.h>
#include <errno.h>
#include <getopt.h>
#include <pwd.h>
#include <grp.h>
#include <libintl.h>
#include <locale.h>
#include <ClearSilver/ClearSilver.h>

#include "common.h"
#include "../common/make_dirs.h"

#define BACKUPCMD "[ -f %s ] && mkdir -p %s%s && cp %s %s%s/$(date +%%Y%%m%%d%%H%%M%%S)"
#define MAX_DATA_ENTRIES 100

NEOERR *csoutfunc(void *ctx, char *str)
{
  fputs(str, (FILE *)ctx);   
  return STATUS_OK;
}

int process_template(HDF *hdf, char *infile, char *outfile)
{
  int ret = 0;
  FILE *outfh = NULL;
  NEOERR *err;
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

int merge_template(HDF *hdf, char *template, char *output)
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
      numtemps = 0;
    }

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

      if ((numtemps + numcustomtemps) == 0)
      {
        fprintf(stderr, "error: %s scandir %s\n", strerror(errno), templatedir);
        ret = -4;
      }
      else
      {
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
      }
      free(templatedir);

      if (ret == 0)
      {
        if (asprintf(&backupcmd, BACKUPCMD, 
             output,                          // [ -f %s ] && 
             PRCTMPLBACKDIR,output, 	  // mkdir -p %s%s && 
             template, PRCTMPLBACKDIR, output // cp %s %s%s/
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
            if (process_template(hdf, templatename, output) < 0)
            {
              ret = -14;
            }
          }
          free(backupcmd);
        }
      }
    }
  }  
  return ret;
}


int main(int argc, char *argv[])
{
  int ret = 0;
  int c;
  char *owner = NULL;
  char *group = NULL;
  mode_t mode = -1;
  char *output = NULL;
  char *database = YAVDRDB;
  NEOERR *err;
  HDF *hdf = NULL;
  char *data[MAX_DATA_ENTRIES];
  int numdata = 0;
  struct stat orig_stat;
  int gid;
  int uid;

  while (1)
  {
    int longindex = 0;
    
    static struct option longopts[] = {
      {"owner", 1, 0, 0},
      {"group", 1, 0, 0},
      {"mode", 1, 0, 0},
      {"output", 1, 0, 0},
      {"data", 1, 0, 0},
      {"database", 1, 0, 0},
      {0, 0, 0, 0}
    };
 
    if ((c = getopt_long(argc, argv, "", longopts, &longindex)) == -1)
      break;

    switch (c) {
    case 0:
      if (!strcmp(longopts[longindex].name, "owner"))
      {
        owner = optarg;
      }
      else if (!strcmp(longopts[longindex].name, "group"))
      {
        group = optarg;
      }
      else if (!strcmp(longopts[longindex].name, "mode"))
      {
        sscanf(optarg, "%o", &mode);
      }
      else if (!strcmp(longopts[longindex].name, "output"))
      {
        output = optarg;
      }
      else if (!strcmp(longopts[longindex].name, "data"))
      {
        if (numdata < MAX_DATA_ENTRIES)
        {
          data[numdata++] = optarg;
        }
        else
        {
          fprintf(stderr, "max. data entires reached! %s ignored", optarg);
        }
      }
      else if (!strcmp(longopts[longindex].name, "database"))
      {
        database = optarg;
      }
      break;
     }
  }
  if (optind < argc)
  {
    setlocale(LC_ALL, "");
    bindtextdomain("yavdr", "/usr/share/yavdr/locale");
    textdomain("yavdr");

    if (!output)
    {
      output = argv[optind];
    }
    if (stat(output,&orig_stat)==0)
    {
      uid = orig_stat.st_uid;
      gid = orig_stat.st_gid;
      if(mode == -1)
        mode = orig_stat.st_mode;
    }
    else
    {
      uid = 0;
      gid = 0;
      if(mode == -1)
        mode = 0644;
    }
    err = hdf_init(&hdf);
    if (err != STATUS_OK)
    {
      nerr_log_error(err);
    }
    else
    {
      err = hdf_read_file(hdf, database);
      if (err != STATUS_OK)
      {
        nerr_log_error(err);
      }
      else
      {
        int i;
   
        for (i = 0; i < numdata; i++)
        {
          err = hdf_set_valuef(hdf, data[i]);
          if (err != STATUS_OK)
          {
            nerr_log_error(err);
          }
        }
        if ((ret = merge_template(hdf, argv[optind], output)) == 0)
        {

          if (owner)
          {
            struct passwd *pwd = NULL;
            if ((pwd = getpwnam(owner)) != NULL)
            {
              uid = pwd->pw_uid;
            } 
            else
            {
              fprintf(stderr, "can't get user id for user %s\n", owner);
            }
          }

          if (group)
          {  
            struct group *grp = NULL;
            if ((grp = getgrnam(group)) != NULL)
            {
              gid = grp->gr_gid;
            } 
            else
            {
              fprintf(stderr, "can't get group id for group %s\n", group);
            }
          }
          chown(output, uid, gid);
          chmod(output, mode);
        }
      }
      hdf_destroy(&hdf);
    }
  }
  else
  {
    fprintf(stderr, "no template file name given!\n");
  }

  return ret;
}
