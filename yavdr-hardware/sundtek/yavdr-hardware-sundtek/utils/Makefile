
CFLAGS=-g -fPIC -I.. 
LDLIBS=-L/usr/lib/yavdr -lyavdrdb -lneo_utl -lmcsimple -L/opt/lib
all: scansundtek sundtekadapter

.c.o:
	${C} ${CFLAGS} -c $<
	
clean:
	@rm -rf scansundtek sundtekadapter *.o

install:
	@install scansundtek sundtekadapter $(DESTDIR)/usr/bin/
