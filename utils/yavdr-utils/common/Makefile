CFLAGS+=-fPIC

all: libyavdutils.a


libyavdutils.a: make_dirs.o
	rm -f $@
	ar cq $@ $^

clean:
	@rm -rf *.o *.a

install:
