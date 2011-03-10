install:
	mkdir -p $(DESTDIR)/etc/sundtek
	install etc/sundtek/* $(DESTDIR)/etc/sundtek
	mkdir -p $(DESTDIR)/etc/sundtek.d/attach
	mkdir -p $(DESTDIR)/etc/sundtek.d/detach
	mkdir -p $(DESTDIR)/etc/sundtek.d/mount
	mkdir -p $(DESTDIR)/etc/sundtek.d/unmount
	install etc/sundtek.d/attach/* $(DESTDIR)/etc/sundtek.d/attach
	install etc/sundtek.d/detach/* $(DESTDIR)/etc/sundtek.d/detach
	install etc/sundtek.d/mount/* $(DESTDIR)/etc/sundtek.d/mount
	install etc/sundtek.d/unmount/* $(DESTDIR)/etc/sundtek.d/unmount
	mkdir -p $(DESTDIR)/usr/bin
	install usr/bin/* $(DESTDIR)/usr/bin

clean:
	echo "done :-)"
all: 
