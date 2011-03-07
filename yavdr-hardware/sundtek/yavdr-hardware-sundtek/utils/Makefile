
CFLAGS=-g -fPIC -I.. 
LDLIBS=-L/usr/lib/yavdr -lyavdrdb -lneo_utl -lmcsimple -L/opt/lib
all: scansundtek sundtekadapter

.c.o:
	${C} ${CFLAGS} -c $<
	
clean:
	@rm -rf scansundtek sundtekadapter *.o

install:
	@install scansundtek sundtekadapter $(DESTDIR)/usr/bin/
	@install attach_sundtek.sh detach_sundtek.sh mount_sundtek.sh unmount_sundtek.sh $(DESTDIR)/usr/bin/
	