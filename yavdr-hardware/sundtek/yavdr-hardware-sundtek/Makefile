SUBDIRS = yavdrweb-ng utils files
.PHONY: $(SUBDIRS)

ALL = $(addsuffix -all,$(SUBDIRS))
INSTALL = $(addsuffix -install,$(SUBDIRS))
CLEAN = $(addsuffix -clean,$(SUBDIRS))

all: $(ALL)
install: $(INSTALL)
clean: $(CLEAN)

$(ALL):
	$(MAKE) -C $(@:-all=) all

$(INSTALL):
	$(MAKE) -C $(@:-install=) install
	for f in events templates; do \
	  cp -pr $$f $(DESTDIR)/usr/share/yavdr; done
#	chmod +x $(DESTDIR)/usr/share/yavdr/events/actions/*
#	cp -pr defaults $(DESTDIR)/usr/share/yavdr
#	install -m 700 untie-packages $(DESTDIR)/usr/sbin
#	install -m 700 yavdr-upgrade $(DESTDIR)/usr/sbin
#	install -m 700 change-vdr-uid $(DESTDIR)/usr/sbin

$(CLEAN):
	$(MAKE) -C $(@:-clean=) clean

