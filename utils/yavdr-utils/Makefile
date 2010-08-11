SUBDIRS = common db-utils process-template signal-event yavdrweb-ng resize-pearlhd
.PHONY: $(SUBDIRS)

ALL = $(addsuffix -all,$(SUBDIRS))
INSTALL = $(addsuffix -install,$(SUBDIRS))
CLEAN = $(addsuffix -clean,$(SUBDIRS))

all: $(ALL) i18n
install: $(INSTALL)
clean: $(CLEAN)

$(ALL): common.h
	$(MAKE) -C $(@:-all=) all

$(INSTALL):
	$(MAKE) -C $(@:-install=) install
	for f in events templates; do \
	  cp -pr $$f $(DESTDIR)/usr/share/yavdr; done
	chmod +x $(DESTDIR)/usr/share/yavdr/events/actions/*
	cp -pr defaults $(DESTDIR)/usr/share/yavdr
	install -m 700 untie-packages $(DESTDIR)/usr/sbin
	install -m 700 yavdr-upgrade $(DESTDIR)/usr/sbin
	install -m 700 change-vdr-uid $(DESTDIR)/usr/sbin

$(CLEAN):
	$(MAKE) -C $(@:-clean=) clean


### Internationalization (I18N):

PODIR     = po
I18Npot   = $(PODIR)/yavdr.pot

$(I18Npot): $(wildcard templates/var/lib/vdr/plugins/menuorg.xml/*)
	@xgettext -C -cTRANSLATORS --no-wrap --no-location -k_ -o $@ $^

.PHONY: i18n
i18n: $(I18Npot)

