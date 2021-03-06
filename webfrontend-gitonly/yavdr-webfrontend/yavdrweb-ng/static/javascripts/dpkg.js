 // Installer Component
YaVDR.DPKG = Ext.extend(Ext.Window, {
  callback: null,
  store: null,
  command: 'update',
  title: _('yaVDR Paket Installer'),
  width: 600,
  height: 450,
  resizable: true,
  maximizable: true,
  closable: false,
  modal: true,
  layout: 'fit',
  id: 'dpkg',
  initComponent: function() {

    if (this.command == 'install' || this.command == 'remove') {
      var url = '/admin/dpkg?command=' + this.command + '&package=' + this.package + '&ts=' + ((new Date()).getTime());
    } else {
      var url = '/admin/dpkg?command=' + this.command + '&ts=' + ((new Date()).getTime());
    }

    this.iframe = new Ext.ux.ManagedIFrame.Panel({
      border: false,
      defaultSrc : url
    });

    this.items = [this.iframe];

    this.closeButton = new Ext.Button({
      disabled:true,
      scope: this,
      text: _('Close'),
      handler: function() {
        this.close();
        if (typeof this.callback == 'function') {
          if (this.scope) {
            this.callback.call(this.scope);
          } else {
            this.callback();
          }
        }
      }
    });

    this.buttons = [this.closeButton];

    YaVDR.DPKG.superclass.initComponent.call(this);

    this.iframe.on('documentloaded', this.onCommandReady, this, { single: true });
  },
  onCommandReady: function() {
    this.closeButton.enable();
  }
});

// Public API
Ext.apply(YaVDR.DPKG, {
  update: function(callback, scope) {
    (new YaVDR.DPKG({
      scope: scope,
      command: 'update',
      callback: callback
    })).show();
  },
  autoremove: function(callback, scope) {
    (new YaVDR.DPKG({
      scope: scope,
      command: 'autoremove',
      callback: callback
    })).show();
  },
  clean: function(scope) {
    (new YaVDR.DPKG({
      scope: scope,
      command: 'clean'
    })).show();
  },
  install: function(package, callback, scope) {
    Ext.Msg.show({
      title: _('Install package?'),
      msg: sprintf(_('Would you like to install package "%s"?', Ext.util.Format.htmlEncode(package))),
      buttons: Ext.Msg.YESNO,
      animEl: 'elId',
      scope: this,
      icon: Ext.MessageBox.QUESTION,
      fn: function(button) {
        if (button == 'yes') {
          (new YaVDR.DPKG({
            scope: scope,
            package: package,
            command: 'install',
            callback: callback
          })).show();
        }
      }
    });
  },
  remove: function(package, callback, scope) {
    Ext.Msg.show({
      title: _('Install package?'),
      msg: sprintf(_('Would you like to remove package "%s"?'), Ext.util.Format.htmlEncode(package)),
      buttons: Ext.Msg.YESNO,
      animEl: 'elId',
      scope: this,
      icon: Ext.MessageBox.QUESTION,
      fn: function(button) {
        if (button == 'yes') {
          (new YaVDR.DPKG({
            scope: scope,
            package: package,
            command: 'remove',
            callback: callback
          })).show();
        }
      }
    });
  },
  enable: function(package, callback, scope) {
    Ext.Msg.show({
      title: _('Enable plugin?'),
      msg: sprintf(_('Would you like to enable "%s"?'), Ext.util.Format.htmlEncode(package)),
      buttons: Ext.Msg.YESNO,
      fn: function(buttonId, text, opt) {
        if (buttonId == "yes") {
          Ext.Ajax.request({
            url: '/admin/set_signal?signal=change-plugin&signal_params=enable ' + package,
            waitMsg: _("Please wait..."),
            timeout: 3000,
            method: 'GET',
            success: function(xhr) {
              callback.call(scope, true);
            },
            failure: function() {
              alert(_('fatal error: disable plugin failed'));
              callback.call(scope, false);
            }
          });
        }
      },
      animEl: 'elId',
      icon: Ext.MessageBox.QUESTION
    });
  },
  disable: function(package, callback, scope) {
    Ext.Msg.show({
      title: _('Disable plugin?'),
      msg: sprintf(_('Would you like to disable "%s"?'), Ext.util.Format.htmlEncode(package)),
      buttons: Ext.Msg.YESNO,
      fn: function(button) {
        if (button == "yes") {
          Ext.Ajax.request({
            url: '/admin/set_signal?signal=change-plugin&signal_params=disable ' + package,
            waitMsg: _("Please wait..."),
            timeout: 3000,
            method: 'GET',
            success: function(xhr) {
              callback.call(scope, true);
            },
            failure: function() {
              alert('fatal error: disable plugin failed');
              callback.call(scope, false);
            }
          });
        }
      },
      animEl: 'elId',
      icon: Ext.MessageBox.QUESTION
    });
  }
});