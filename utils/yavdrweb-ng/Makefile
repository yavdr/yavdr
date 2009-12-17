
all: yavdrweb.so

test: all
	${TNTNET} -c tntnet.localtest.conf

yavdrweb.so: ../common/make_dirs.o neo_hdf.o neo_err.o auth.o authenticate.o yavdrweb.o \
             set_lirchw.o set_file_content.o \
             get_lirchwdb.o get_svdrp_response.o get_file_content.o
	${CXX} -o $@ $^ ${LDFLAGS}

.SUFFIXES: .ecpp .gif .jpg .css .js .cpp .png
EXTRA_ENV+="PATH=$$PATH:/usr/bin"
ECPPC=env ${EXTRA_ENV} ecppc -v
TNTNET=env ${EXTRA_ENV} tntnet
CXXFLAGS+=-I.. -I/usr/include -I/usr/include/ClearSilver -fPIC -O2
CFLAGS+=-I/usr/include/ClearSilver -I/usr/include/ClearSilver/util -fPIC -O2
LDFLAGS+=-shared -L/usr/lib -ltntnet -lneo_utl -lpam #-lcxxtools

.ecpp.cpp:
	${ECPPC} ${ECPPFLAGS} ${ECPPFLAGS_CPP} $<
.gif.cpp:
	${ECPPC} ${ECPPFLAGS} ${ECPPFLAGS_GIF} -b $<
.jpg.cpp:
	${ECPPC} ${ECPPFLAGS} ${ECPPFLAGS_JPG} -b $<
.png.cpp:
	${ECPPC} ${ECPPFLAGS} ${ECPPFLAGS_PNG} -b $<
.css.cpp:
	${ECPPC} ${ECPPFLAGS} ${ECPPFLAGS_CSS} -b $<
.js.cpp:
	${ECPPC} ${ECPPFLAGS} ${ECPPFLAGS_JS} -b $<
.cpp.o:
	${CXX} ${CPPFLAGS} ${CXXFLAGS} -c $<

clean:
	@rm -f *.o *.so 

install:
	@install -d $(DESTDIR)/usr/lib/yavdrweb
	@install yavdrweb.so $(DESTDIR)/usr/lib/yavdrweb/
	@install -d $(DESTDIR)/etc/tntnet.d
	@install tntnet.conf $(DESTDIR)/etc/tntnet.d/yavdrweb.conf
	@cp -pr static $(DESTDIR)/usr/lib/yavdrweb/	

