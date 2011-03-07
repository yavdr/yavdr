LOCDIR   = ./locale
CFLAGS=-g -fPIC -I.. -DLOCDIR=\"$(LOCDIR)\" 
LDLIBS=-L/usr/lib/yavdr -lyavdrdb -lneo_utl -lX11

all: signalsession

clean:
	@rm -rf signalsession *.o

install:
	@install signalsession $(DESTDIR)/usr/bin/
