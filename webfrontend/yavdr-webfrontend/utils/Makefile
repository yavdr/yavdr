LOCDIR   = ./locale
CFLAGS=-g -fPIC -I.. -I/usr/include/NVCtrl -I/usr/share/doc/nvidia-settings/examples/samples -DLOCDIR=\"$(LOCDIR)\" 
LDLIBS=-lXNVCtrl -lXext

all: getdevices

dvb-test.o: ../common.h

clean:
	@rm -rf getdevices *.o

install:
	@install getdevices $(DESTDIR)/usr/bin/
