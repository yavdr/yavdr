CFLAGS=-g -I.. -I/usr/include/ClearSilver
LDLIBS=-lneo_utl -lneo_cs

all: dbget dbset dbremove

dbget: dbget.o

dbget.o: ../common.h

dbremove: dbremove.o

dbremove.o: ../common.h

dbset: dbset.o

dbset.o: ../common.h

clean:
	@rm -rf dbremove dbget dbset *.o

install:
	@install dbget $(DESTDIR)/usr/bin/
	@install dbset $(DESTDIR)/usr/bin/
	@install dbremove $(DESTDIR)/usr/bin/