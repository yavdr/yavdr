#include <fcntl.h>
#include <ClearSilver.h>
#include <stdio.h>
#include "common.h"
#include "dbremove.h"

int main(int argc, char *argv[]) {
  return dbremove(argv[1]);
}
