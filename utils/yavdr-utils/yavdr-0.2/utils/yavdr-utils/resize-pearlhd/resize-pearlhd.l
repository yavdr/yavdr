%option noyywrap
%{
#include <stdlib.h>
#include <unistd.h>
#include <strings.h>

double ratio;

%}
%%
[xy][12]=\"[+-]?[0-9]*\" {
  int value = 0;
  char *str = strdup(yytext);
  char *ptr = strrchr(str, '\"');
  *ptr = '\0';
  ptr = strchr(str, '\"');
  *ptr++ = '\0';
  value = atoi(ptr);
  value = (value == -1) ? -1 : (int)(((double)value / ratio) + 0.5);
  printf("%s\"%d\"", str, value);
  free(str);
}

font=\".*:.*@[0-9]+\" {
  int value = 0;
  char *str = strdup(yytext);
  char *ptr = strrchr(str, '\"');
  *ptr = '\0';
  ptr = strchr(str, '@');
  *ptr++ = '\0';
  value = atoi(ptr);
  value = (int)((double)value / ratio);
  printf("%s@%d\"", str, value);
  free(str);
}
%%
int main(int argc, char *argv[])
{
  int opt;
  int width = -1;
 
  while ((opt = getopt(argc, argv, "w:")) != -1)
  {
    switch (opt) {
    case 'w':
      width = atoi(optarg);
      break ;
    default: /* '?' */
     fprintf(stderr, "Usage: %s -w width [-h height] \n", argv[0]);
     exit(EXIT_FAILURE);
    }
  }
  if (width <= 0)
  {
    fprintf(stderr, "Usage: %s -w width \n", argv[0]);
    exit(EXIT_FAILURE);
  }

  ratio = 1920.0 / (double)width;

  return yylex();
}

