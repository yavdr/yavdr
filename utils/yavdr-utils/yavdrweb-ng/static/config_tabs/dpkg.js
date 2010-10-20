 
// Installer Component
YaVDR.DPKG = Ext.extend(Ext.Window, {
  callback: null,
  store: null,
  command: 'update',
  title: 'yaVDR Paket Installer',
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
      var url = 'dpkg?command=' + this.command + '&package=' + this.package + '&ts=' + ((new Date()).getTime());
    } else {
      var url = 'dpkg?command=' + this.command + '&ts=' + ((new Date()).getTime());
    }
        
    this.iframe = new Ext.ux.ManagedIFrame.Panel({
      border: false,
      defaultSrc : url
    });

    this.items = [this.iframe];

    this.closeButton = new Ext.Button({
      disabled:true,
      scope: this,
      text: 'Close',
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
    
    this.iframe.on('domready', this.activateCloseButton, this, { single: true });
  },
  activateCloseButton: function() {
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
  install: function(package, callback, scope) {
    Ext.Msg.show({
      title:'Install package?',
      msg: 'Would you like to install package "' + Ext.util.Format.htmlEncode(package) + '"?',
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
      title:'Install package?',
      msg: 'Would you like to remove package "' + Ext.util.Format.htmlEncode(package) + '"?',
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
      title:'enable plugin?',
      msg: 'Would you like to enable "' + Ext.util.Format.htmlEncode(package) + '"?',
      buttons: Ext.Msg.YESNO,
      fn: function(buttonId, text, opt) {
        if (buttonId == "yes") {
          Ext.Ajax.request({
            url: 'set_signal?signal=change-plugin&signal_params=enable ' + package,
            waitMsg: getLL("nvidia.submit.waitmsg"),
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
  },
  disable: function(package, callback, scope) {
    Ext.Msg.show({
      title:'disable plugin?',
      msg: 'Would you like to disable "' + Ext.util.Format.htmlEncode(package) + '"?',
      buttons: Ext.Msg.YESNO,
      fn: function(button) {
        if (button == "yes") {
          Ext.Ajax.request({
            url: 'set_signal?signal=change-plugin&signal_params=disable ' + package,
            waitMsg: getLL("nvidia.submit.waitmsg"),
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