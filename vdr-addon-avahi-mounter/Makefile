SUBDIRS = i18n
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
	mkdir -p $(DESTDIR)/usr/bin
	mkdir -p $(DESTDIR)/etc/init
	mkdir -p $(DESTDIR)/etc/avahi/services
	mkdir -p $(DESTDIR)/var/lib/vdr
	install -m 700 avahi-mounter $(DESTDIR)/usr/bin
	install avahi-mounter.conf $(DESTDIR)/etc/init
	install -m 700 services/* $(DESTDIR)/etc/avahi/services
	install -m 500 config/avahi-mounter $(DESTDIR)/etc/default
	install -o vdr -g vdr -m 500 config/.avahi-mounter $(DESTDIR)/var/lib/vdr

$(CLEAN):
	$(MAKE) -C $(@:-clean=) clean





