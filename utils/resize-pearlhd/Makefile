CFLAGS=-g -O0 -I..
LDLIBS=-lm

all: resize-pearlhd

resize-pearlhd: resize-pearlhd.o

clean:
	@rm -rf resize-pearlhd resize-pearlhd.o

install:
	@install resize-pearlhd $(DESTDIR)/usr/bin/
