SUBDIRS = common db-utils process-template signal-event yavdrweb-ng resize-pearlhd
.PHONY: $(SUBDIRS)

ALL = $(addsuffix -all,$(SUBDIRS))
INSTALL = $(addsuffix -install,$(SUBDIRS))
CLEAN = $(addsuffix -clean,$(SUBDIRS))

all: $(ALL)
install: $(INSTALL)
clean: $(CLEAN)

$(ALL): common.h
	$(MAKE) -C $(@:-all=) all

$(INSTALL):
	$(MAKE) -C $(@:-install=) install
	for f in events templates; do \
	  cp -pr $$f $(DESTDIR)/etc/yavdr; done
	chmod +x $(DESTDIR)/etc/yavdr/events/actions/*
	cp -pr defaults $(DESTDIR)/usr/share/yavdr
	install -m 700 untie-packages $(DESTDIR)/usr/sbin

$(CLEAN):
	$(MAKE) -C $(@:-clean=) clean

