### Internationalization (I18N):

PODIR     = ./
LOCALEDIR = $(DESTDIR)/usr/share/vdr-addon-avahi-mounter/locale
I18Npo    = $(wildcard $(PODIR)/*.po)
I18Nmsgs  = $(addprefix $(LOCALEDIR)/, $(addsuffix /LC_MESSAGES/vdr-addon-avahi-mounter.mo, $(notdir $(foreach file, $(I18Npo), $(basename $(file))))))
I18Npot   = $(PODIR)/vdr-addon-avahi-mounter.pot

.PHONY: i18n clean
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

clean:
	@rm -f *.mo
