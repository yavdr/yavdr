all:


install:
	install -d $(DESTDIR)/etc/udev/rules.d
	install 92-vfd.rules $(DESTDIR)/etc/udev/rules.d
	install LCDd.conf.mdm166a $(DESTDIR)/etc
	install -d $(DESTDIR)/usr/share/yavdr/templates/etc/init/xbmc.conf
	install 14_comment_out_pre_post_app.template $(DESTDIR)/usr/share/yavdr/templates/etc/init/xbmc.conf/14_comment_out_pre_post_app_mdm166a
	install 16_end_comment_out_pre_post_app.template $(DESTDIR)/usr/share/yavdr/templates/etc/init/xbmc.conf/14_end_comment_out_pre_post_app_mdm166a
	install 17_pre_post_app_mdm166a.template $(DESTDIR)/usr/share/yavdr/templates/etc/init/xbmc.conf/17_pre_post_app_mdm166a

clean:

