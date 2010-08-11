#!/bin/sh
jpegtopnm cd.jpg | pnmscale -xsize=720 -ysize=576 | \
	ppmtoy4m -F 25:1 -A 4:3 -I p -r -S 420mpeg2 -v 2 -n 1 | \
	mpeg2enc -f 8 -a 2 -q 1 -n p -T 120 -R 2 -g 12 -G 12 -o cd.mpg
