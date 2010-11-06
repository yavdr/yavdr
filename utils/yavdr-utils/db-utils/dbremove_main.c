#include <fcntl.h>
#include <ClearSilver.h>
#include <stdio.h>
#include "common.h"
#include "dbremove.h"

int main(int argc, char *argv[]) {
  int ret = 0;

  if (argc == 2)  
    ret = dbremove(argv[1]);

  return ret;
}
