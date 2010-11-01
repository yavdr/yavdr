#include <fcntl.h>
#include <stdio.h>
#include "common.h"
#include "dbget.h"

int main(int argc, char *argv[])
{
  int ret = 0;
  char *value = NULL;

  value = dbget(argv[1], (argc == 3) ? argv[2]: "");
  if (value != NULL)
  {
    fputs(value, stdout);
    free(value);
  }

  return ret;
}
