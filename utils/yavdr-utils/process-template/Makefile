LOCDIR   = ./locale
CFLAGS=-g -I.. -I/usr/include/ClearSilver -DLOCDIR=\"$(LOCDIR)\" 
LDLIBS=../common/make_dirs.o -lneo_utl -lneo_cs

all: process-template

process-template: process-template.o

process-template.o: ../common.h

clean:
	@rm -rf process-template process-template.o

install:
	@install process-template $(DESTDIR)/usr/bin/
