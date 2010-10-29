YaVDR.Commands = Ext.extend(YaVDR.BaseFormPanel, {
  initComponent: function() {
    
    this.tbar = [
      {
        icon: '/static/images/icons/system_stop.png',
        text: 'VDR stoppen',
        scope: this,
        handler: this.stopVdr
      },
      {
        icon: '/static/images/icons/system_vdr_restart.png',
        text: getLL("system.vdr_restart.label"),
        scope: this,
        handler: this.restartVdr
      }, 
      {
        icon: '/static/images/icons/system_kill_xbmc.png',
        text: getLL("system.kill_xbmc.label"),
        scope: this,
        handler: this.killXBMC
      },
      {
        icon: '/static/images/icons/system_restart.png',
        text: getLL("system.system_restart.label"),
        scope: this,
        handler: this.restartSystem
      },
    ];
    
    this.html = "";
    
    YaVDR.Commands.superclass.initComponent.call(this);
  },
  stopVdr: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=stop_vdr',
      waitMsg:'Das Signal zum Stoppen des VDR wird abgesetzt.',
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert('Message', 'Der VDR wird nun gestoppt.');
      },
      failure:function(form, action) {
        Ext.MessageBox.alert('Message', 'Fehler beim Absetzen des Signals. Bitte noch einmal versuchen.');
      }
    })
  },
  restartVdr: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=restart-vdr',
      waitMsg: getLL("system.vdr_restart.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("system.vdr_restart.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("system.vdr_restart.submit.failure") );
      }
    })
  },
  killXBMC: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=kill-xbmc',
      waitMsg: getLL("system.kill_xbmc.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("system.kill_xbmc.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("system.kill_xbmc.submit.failure") );
      }
    })
  },
  restartSystem: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=reboot',
      waitMsg: getLL("system.system_restart.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("system.system_restart.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("system.system_restart.submit.failure") );
      }
    })
  }
  
});

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "system",
                layout: 'fit',
                items:   function() { return new YaVDR.Commands }});
});