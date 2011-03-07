#include <stdio.h>
#include <stdarg.h>
#include <stdlib.h>
#include <yavdr/common.h>
#include <yavdr/db-utils/dbset.h>
#include <time.h>


int main(int argc, char *argv[])
{
	int valid = 0;
	if (argc == 2) {
		if (
			strcmp ("settings_hw_sundtek", argv[1]) == 0
		) {
			valid = 1;
		}

		if (valid) {
			char *code;
			time_t ts = time (NULL);
			if (asprintf(&code, "webfrontend.session.update.%s=%li", argv[1], (long int)ts) >= 0) {
				return dbset(code);
			}
		} else
			return 1;
	}
}
