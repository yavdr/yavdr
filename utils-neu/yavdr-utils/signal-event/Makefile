CFLAGS=-g -I..
LDLIBS=

all: signal-event

signal-event: signal-event.o

signal-event.o: ../common.h

clean:
	@rm -rf signal-event signal-event.o

install:
	@install signal-event $(DESTDIR)/usr/bin/
