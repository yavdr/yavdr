### Internationalization (I18N):

PODIR     = ./
LOCALEDIR = $(DESTDIR)/usr/share/vdr-addon-avahi-mounter/locale
LOCDIR    = $(PREFIX)/share/locale
I18Npo    = $(wildcard $(PODIR)/*.po)
I18Nmsgs  = $(addprefix $(LOCALEDIR)/, $(addsuffix /LC_MESSAGES/vdr-addon-avahi-mounter.mo, $(notdir $(foreach file, $(I18Npo), $(basename $(file))))))
I18Npot   = $(PODIR)/vdr-addon-avahi-mounter.pot

all:
	@echo "Done."


i18n: $(I18Nmsgs)

%.mo: %.po
	msgfmt -c -o $@ $<

%.po: $(PODIR)/vdr-addon-avahi-mounter.pot
	msgmerge -U --no-wrap --no-location --backup=none -q $@ $<
	@touch $@

$(I18Nmsgs): $(LOCALEDIR)/%/LC_MESSAGES/vdr-addon-avahi-mounter.mo: $(PODIR)/%.mo
	@mkdir -p $(dir $@)
	echo cp $< $@
	cp $< $@

install-i18n:
	@mkdir -p $(DESTDIR)$(LOCDIR)
	@(cd $(LOCALEDIR); cp -r --parents * $(DESTDIR)$(LOCALEDIR))

install: i18n

clean:
	@rm -f *.mo
