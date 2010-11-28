CFLAGS+=-fPIC

all: libyavdrutils.a


libyavdrutils.a: make_dirs.o
	rm -f $@
	ar cq $@ $^

clean:
	@rm -rf *.o *.a

install:
	@mkdir -p $(DESTDIR)/usr/include/yavdr
	@cp make_dirs.h $(DESTDIR)/usr/include/yavdr
	@mkdir -p $(DESTDIR)/usr/lib/yavdr
	@cp libyavdrutils.a $(DESTDIR)/usr/lib/yavdr
