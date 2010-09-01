clean:

install:
	install -d $(DESTDIR)/usr/bin \
		$(DESTDIR)/usr/share/debhelper/autoscripts
	install $(shell find -maxdepth 1 -mindepth 1 -name dh\* |grep -v \.1\$$) $(DESTDIR)/usr/bin
	install -m 0644 autoscripts/* $(DESTDIR)/usr/share/debhelper/autoscripts
