install:
	for f in etc; do \
	cp -pr $$f $(DESTDIR)/etc; done
	chmod +x $(DESTDIR)/etc/sundtek/*
	chmod +x $(DESTDIR)/etc/sundtek.d/*/*
	for f in usr; do \
	cp -pr $$f $(DESTDIR); done
	chmod +x $(DESTDIR)/usr/bin/*
  

clean:
	echo "done :-)"
all: 
