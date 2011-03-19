LOCDIR   = ./locale
CFLAGS=-g -fPIC -I.. -DLOCDIR=\"$(LOCDIR)\"  -I/usr/share/doc/nvidia-settings/examples/samples/ -I/usr/include/NVCtrl
LDLIBS=-L/usr/lib/yavdr -lyavdrdb -lneo_utl -lX11 -lXNVCtrl -lXext

all: signalsession getNVdevices

clean:
	@rm -rf signalsession getNVdisplays *.o

install:
	@install signalsession getNVdisplays $(DESTDIR)/usr/bin/
