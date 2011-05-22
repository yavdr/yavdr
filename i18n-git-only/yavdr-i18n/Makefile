### Internationalization (I18N):

PODIR     = ./
LOCALEDIR = $(DESTDIR)/usr/share/locale
LOCALEDIRJSON = $(DESTDIR)/usr/share/yavdr/locale
I18Npo    = $(wildcard $(PODIR)/*.po)
I18Nmsgs  = $(addprefix $(LOCALEDIR)/, $(addsuffix /LC_MESSAGES/yavdr.mo, $(notdir $(foreach file, $(I18Npo), $(basename $(file))))))
I18Npot   = $(PODIR)/yavdr.pot
I18Njson  = $(addprefix $(LOCALEDIRJSON)/, $(addsuffix /LC_MESSAGES/yavdr.json, $(notdir $(foreach file, $(I18Npo), $(basename $(file))))))

.PHONY: i18n clean
i18n: $(I18Nmsgs) $(I18Njson)

%.mo: %.po
	msgfmt -c -o $@ $<

%.po: $(PODIR)/yavdr.pot
	msgmerge -U --no-wrap --no-location --backup=none -q $@ $<
	@touch $@

$(I18Nmsgs): $(LOCALEDIR)/%/LC_MESSAGES/yavdr.mo: $(PODIR)/%.mo
	@mkdir -p $(dir $@)
	echo cp $< $@
	cp $< $@

$(I18Njson): $(LOCALEDIRJSON)/%/LC_MESSAGES/yavdr.json: $(PODIR)/%.po
	@mkdir -p $(dir $@)
	po2json/po2json -p $< >$@

clean:
	@rm -f *.mo
