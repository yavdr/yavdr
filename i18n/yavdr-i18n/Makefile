### Internationalization (I18N):

PODIR     = ./
LOCALEDIR = $(DESTDIR)/usr/share/yavdr/locale
I18Npo    = $(wildcard $(PODIR)/*.po)
I18Nmsgs  = $(addprefix $(LOCALEDIR)/, $(addsuffix /LC_MESSAGES/yavdr.mo, $(notdir $(foreach file, $(I18Npo), $(basename $(file))))))
I18Npot   = $(PODIR)/yavdr.pot

%.mo: %.po
	msgfmt -c -o $@ $<

%.json: %.po
	po2json $< >$@

%.po: $(PODIR)/yavdr.pot
	msgmerge -U --no-wrap --no-location --backup=none -q $@ $<
	@touch $@

$(I18Nmsgs): $(LOCALEDIR)/%/LC_MESSAGES/yavdr.mo: $(PODIR)/%.mo
	@mkdir -p $(dir $@)
	cp $< $@

.PHONY: i18n clean
i18n: $(I18Nmsgs)

clean:
	@rm -f *.mo
