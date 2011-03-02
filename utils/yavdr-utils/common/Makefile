CFLAGS+=-fPIC

all: libyavdrutils.a


libyavdrutils.a: make_dirs.o
	rm -f $@
	ar cq $@ $^

clean:
	@rm -rf *.o *.a

install:
	@mkdir -p $(DESTDIR)/usr/include/yavdr
	@mkdir -p $(DESTDIR)/usr/lib/yavdr
