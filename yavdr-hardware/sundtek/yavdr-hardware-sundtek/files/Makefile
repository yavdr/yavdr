install:
	for f in `find etc -type f | grep -v .svn`; do \
	  mkdir -p `dirname $$f`; \
	  install $$f $(DESTDIR)/`dirname $$f`; \
    done
