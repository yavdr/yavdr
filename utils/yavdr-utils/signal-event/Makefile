CFLAGS=-g -I..
LDLIBS=

all: signal-event.real

signal-event.real: signal-event.real.o

signal-event.real.o: ../common.h

clean:
	@rm -rf signal-event.real signal-event.real.o

install:
	@install signal-event $(DESTDIR)/usr/bin/
	@install signal-event.real $(DESTDIR)/usr/bin/
