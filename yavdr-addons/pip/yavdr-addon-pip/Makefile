all:


install:
	@mkdir -p $(DESTDIR)/var/lib
	@cp -a vdr-pip $(DESTDIR)/var/lib
	@mkdir -p $(DESTDIR)/usr/share/yavdr
	@cp -a templates $(DESTDIR)/usr/share/yavdr
	@mkdir -p $(DESTDIR)/usr/bin
	@cp piponoff pipswap $(DESTDIR)/usr/bin
	@mkdir -p $(DESTDIR)/etc/init
	@cp vdr-pip.conf pipswap.conf $(DESTDIR)/etc/init

clean:
