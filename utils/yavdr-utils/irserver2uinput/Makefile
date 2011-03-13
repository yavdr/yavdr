CFLAGS=-g

all: irserver2uinput

irserver2uinput: irserver2uinput.c input_map.h

clean:
	@rm -f irserver2uinput
install:
	@install -m 755 irserver2uinput $(DESTDIR)/usr/bin
	@install -m 644 irserver.conf $(DESTDIR)/etc/init
	@install -m 644 irserver2uinput.conf $(DESTDIR)/etc/init
	@install -m 644 98-eventlircd4irserver.rules $(DESTDIR)/lib/udev/rules.d
