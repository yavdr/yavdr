SUBDIRS = common yavdrweb-ng
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
	mkdir -p $(DESTDIR)/etc/tntnet
	install misc/tntnet.conf	$(DESTDIR)/etc/tntnet

$(CLEAN):
	$(MAKE) -C $(@:-clean=) clean

