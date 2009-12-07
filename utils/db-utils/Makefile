CFLAGS=-g -I.. -I/usr/include/ClearSilver
LDLIBS=-lneo_utl -lneo_cs

all: dbget dbset

dbget: dbget.o

dbget.o: ../common.h

dbset: dbset.o

dbset.o: ../common.h

clean:
	@rm -rf dbget dbset *.o

install:
	@install dbget $(DESTDIR)/usr/bin/
	@install dbset $(DESTDIR)/usr/bin/
