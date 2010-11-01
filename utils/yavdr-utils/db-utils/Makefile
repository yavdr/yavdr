CFLAGS=-g -I.. -I/usr/include/ClearSilver
LDLIBS=-lneo_utl -lneo_cs

all: dbget dbset dbremove libyavdrdb.a

dbget_main.o dbget.o: dbget.h

dbget: dbget_main.o dbget.o

dbget.o: ../common.h

dbremove: dbremove.o

dbremove.o: ../common.h

dbset_main.o dbset.o: dbset.h

dbset: dbset_main.o dbset.o

dbset.o: ../common.h

libyavdrdb.a: dbget.o dbset.o
	rm -f $@
	ar cq $@ $^

clean:
	@rm -rf dbremove dbget dbset *.o *.a

install:
	@install dbget $(DESTDIR)/usr/bin/
	@install dbset $(DESTDIR)/usr/bin/
	@install dbremove $(DESTDIR)/usr/bin/
