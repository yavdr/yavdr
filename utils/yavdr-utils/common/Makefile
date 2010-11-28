CFLAGS+=-fPIC

all: libyavdutils.a


libyavdutils.a: make_dirs.o
	rm -f $@
	ar cq $@ $^

clean:
	@rm -rf *.o *.a

install:
	@mkdir -p $(DESTDIR)/usr/lib/yavdr
	@cp libyavdutils.a $(DESTDIR)/usr/lib/yavdr
