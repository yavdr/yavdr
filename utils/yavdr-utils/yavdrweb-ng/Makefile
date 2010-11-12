
all: yavdrweb.so

test: CEXTRAFLAGS=-g
test: all testdeploy
	${TNTNET} -d -c tntnet.localtest.conf

yavdrweb.so: ../common/make_dirs.o \
             neo_hdf.o neo_err.o auth.o authenticate.o yavdrweb.o \
             set_lirchw.o set_file_content.o set_signal.o set_hdf_value.o \
             get_lirchwdb.o get_svdrp_response.o get_file_content.o \
             get_shell_response.o get_hdf_value.o get_recordings.o \
             get_timers.o get_autofs_config.o set_autofs_config.o \
             get_inputlirc.o get_irserver.o set_inputlirc.o set_irserver.o \
             get_x11.o set_x11.o get_packages.o dpkg.o session.o
	${CXX} -o $@ $^ ${LDFLAGS}

testdeploy: all
	@mkdir -p /tmp/yavdrweb	
	@cp -pfr yavdrweb.so /tmp/yavdrweb
	@cp -pfr static /tmp/yavdrweb
	@cp -pfr ../templates /tmp/yavdrweb
	
.SUFFIXES: .ecpp .gif .jpg .css .js .cpp .png
EXTRA_ENV+="PATH=$$PATH:/usr/bin"
ECPPC=env ${EXTRA_ENV} ecppc -v
TNTNET=env ${EXTRA_ENV} tntnet
ifeq ($(CEXTRAFLAGS),)
     CEXTRAFLAGS=-O2
endif
CXXFLAGS+=-I.. -I/usr/include -I/usr/include/ClearSilver -fPIC $(CEXTRAFLAGS)
CFLAGS+=-I/usr/include/ClearSilver -I/usr/include/ClearSilver/util -I/usr/include/NVCtrl -fPIC $(CEXTRAFLAGS)
LDFLAGS+=-shared -L/usr/lib -ltntnet -lneo_utl -lneo_cs -lpam -lXNVCtrl -lX11 -lXext -ljson -lboost_regex -L../db-utils -lyavdrdb -lsvdrp

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
	@install -d $(DESTDIR)/usr/lib/yavdrweb
	@install yavdrweb.so $(DESTDIR)/usr/lib/yavdrweb/
	@install -d $(DESTDIR)/etc/tntnet.d
	@install tntnet.conf $(DESTDIR)/etc/tntnet.d/yavdrweb.conf
	@cp -pr static $(DESTDIR)/usr/lib/yavdrweb/	

