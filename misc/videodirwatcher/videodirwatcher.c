#include <stdio.h>
#include <inotifytools/inotify.h>
#include <inotifytools/inotifytools.h>

int main(int argc, char **argv)
{
  if (argc != 2)
  {
    fprintf(stderr, "usage: %s <video dir to watch>\n", argv[0]);
    return -1;
  }

  inotifytools_initialize();

  inotifytools_watch_file(argv[1], IN_CREATE | IN_DELETE | IN_DELETE_SELF);

  printf("watching dir %s\n", argv[1]);

  for (;;)
  {
    struct inotify_event *event = inotifytools_next_event(-1);

    inotifytools_printf(event, "in %w, file %f had event(s): %.e\n");
  }

  return 0;
}

