CFLAGS=-g -fPIC -I.. -I/usr/include/ClearSilver
LDLIBS=-lneo_utl -lneo_cs

all: dbget dbset dbremove libyavdrdb.a

dbget_main.o dbget.o: dbget.h ../common.h

dbget: dbget_main.o dbget.o

dbremove_main.o dbremove.o: dbremove.h ../common.h

dbremove: dbremove_main.o dbremove.o

dbset_main.o dbset.o: dbset.h ../common.h

dbset: dbset_main.o dbset.o

libyavdrdb.a: dbget.o dbset.o dbremove.o
	rm -f $@
	ar cq $@ $^

clean:
	@rm -rf dbremove dbget dbset *.o *.a

install:
	@install dbget $(DESTDIR)/usr/bin/
	@install dbset $(DESTDIR)/usr/bin/
	@install dbremove $(DESTDIR)/usr/bin/
