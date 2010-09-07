LOCDIR   = ./locale
CFLAGS=-g -I.. -I/usr/include/ClearSilver -DLOCDIR=\"$(LOCDIR)\" 
LDLIBS=../common/make_dirs.o -lneo_utl -lneo_cs

all: dvb-test

process-template: dvb-test.o

dvb-test.o: ../common.h

clean:
	@rm -rf process-template dvb-test.o

install:
	@install dvb-test $(DESTDIR)/usr/bin/
