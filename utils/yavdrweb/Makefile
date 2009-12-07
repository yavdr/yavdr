
all: yavdrweb.so

test: all
	${TNTNET} tntnet.conf

yavdrweb.so: yavdrweb.o components.o set_value.o get_value.o wrapper.o\
             neo_hdf.o neo_err.o lirc.o plate.o style.o advancedsettings.o browser.o \
             Eterm.o kcmdevices.o rosetta.o icon_close.o icon_maximize.o icon_minimize.o ajax.o \
             keyboard.o karm.o wlassistant.o internet_connection_tools.o kthememgr.o kmixdocked.o \
             klaptop.o hardware.o usbpendrive_unmount.o
	${CXX} -o $@ $^ ${LDFLAGS}

.SUFFIXES: .ecpp .gif .jpg .css .js .cpp .png
EXTRA_ENV+="PATH=$$PATH:/usr/bin"
ECPPC=env ${EXTRA_ENV} ecppc -v
TNTNET=env ${EXTRA_ENV} tntnet
CXXFLAGS+=-I/usr/include -I/usr/include/ClearSilver -fPIC -O2
CFLAGS+=-I/usr/include/ClearSilver -I/usr/include/ClearSilver/util -fPIC -O2
LDFLAGS+=-shared -L/usr/lib -ltntnet -lneo_utl #-lcxxtools

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
	@install navigation.hdf $(DESTDIR)/usr/share/yavdr

