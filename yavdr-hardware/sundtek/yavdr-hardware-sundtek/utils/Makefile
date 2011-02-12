
CFLAGS=-g -fPIC -I.. 
LDLIBS=-L/usr/lib/yavdr -lyavdrdb -lneo_utl -lmcsimple -L/opt/lib
all: scansundtek

.c.o:
	${C} ${CFLAGS} -c $<
	
clean:
	@rm -rf scansundtek *.o

install:
	@install scansundtek $(DESTDIR)/usr/bin/
