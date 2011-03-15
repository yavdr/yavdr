YAVDRWEBDIR=../../../../webfrontend/yavdr-webfrontend/yavdrweb-ng/

all: sundtek.so

test: all testdeploy
	make -C ${YAVDRWEBDIR} testdeploy
	make -C ${YAVDRWEBDIR} test

testdeploy: all
	@mkdir -p /tmp/yavdrweb
	@cp -f sundtek.so /tmp/yavdrweb/
	@cp -pfr static /tmp/yavdrweb
	@cp -pfr ../templates /tmp/yavdrweb
	
sundtek.so: get_dvb.o set_dvb.o rescan.o remove_dvb.o
	${CXX} -o $@ $^ ${LDFLAGS}

.SUFFIXES: .ecpp .gif .jpg .css .js .cpp .png
EXTRA_ENV+="PATH=$$PATH:/usr/bin"
ECPPC=env ${EXTRA_ENV} ecppc -v
TNTNET=env ${EXTRA_ENV} tntnet
CXXFLAGS+=-I/usr/include -I/usr/include/yavdr -I/usr/include/ClearSilver -I/usr/include/sundtek -fPIC -g #-O2
#LDFLAGS+=-shared -L/usr/lib -ltntnet -lneo_utl -lneo_cs -lpam -lXNVCtrl -lX11 -lXext -ljson -lboost_regex -L/usr/lib/yavdr -lyavdrdb -lsvdrp -lyavdrutils

LDFLAGS+=-shared -L/usr/lib -ltntnet -lneo_utl -ljson -L/opt/lib/ -lmediaclient -lmcsimple -L/usr/lib/yavdr -lyavdrdb

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
	@rm -rf /tmp/yavdrweb
	
install:
#	@install -d $(DESTDIR)/usr/lib/yavdrweb
	@mkdir -p $(DESTDIR)/usr/lib/yavdrweb
	@install sundtek.so $(DESTDIR)/usr/lib/yavdrweb/
#	@install -d $(DESTDIR)/etc/tntnet.d
	@cp -pr static $(DESTDIR)/usr/lib/yavdrweb

