YAVDRWEBDIR=../../../../utils/yavdr-utils/yavdrweb-ng/

all: sundtek.so

test: all
#	cp -f sundtek.so ${YAVDRWEBDIR}
#	#${TNTNET} -c ${YAVDRWEBDIR}tntnet.localtest.conf

sundtek.so: get_dvb.o set_dvb.o
	${CXX} -o $@ $^ ${LDFLAGS}

.SUFFIXES: .ecpp .gif .jpg .css .js .cpp .png
EXTRA_ENV+="PATH=$$PATH:/usr/bin"
ECPPC=env ${EXTRA_ENV} ecppc -v
TNTNET=env ${EXTRA_ENV} tntnet
CXXFLAGS+=-I/usr/include -I/usr/include/yavdr/yavdrweb-ng -I/usr/include/ClearSilver -fPIC -O2
CFLAGS+=-I/usr/include/ClearSilver -I/usr/include/ClearSilver/util -I/usr/include/NVCtrl -fPIC -O2
LDFLAGS+=-shared -L/usr/lib -ltntnet -lneo_utl

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
	@rm -f *.o *.so *.cpp

install:
#	@install -d $(DESTDIR)/usr/lib/yavdrweb
	@install sundtek.so $(DESTDIR)/usr/lib/yavdrweb/
#	@install -d $(DESTDIR)/etc/tntnet.d
	@cp -pr static $(DESTDIR)/usr/lib/yavdrweb

