YaVDR.Grub = Ext.extend(YaVDR.BaseFormPanel, {
  initComponent: function() {
    this.items = [
      new Ext.ux.form.SpinnerField({
        itemId: 'timeout',
        fieldLabel: getLL("timeout.label"),
        name: 'value',
        minValue: 0,
        maxValue: 10,
        defaultValue: 0,
        maxText: getLL("timeout.maxText"),
        minText: getLL("timeout.minText")
      })
    ];
    
    this.tbar = [
      {
        scope: this,
        itemId: 'save',
        text: 'Speichern',
        icon: '/static/images/icons/save.png',
        handler: this.saveData
      }
    ];
    YaVDR.Grub.superclass.initComponent.call(this);
    this.on('render', this.loadData, this);
  },
  loadData: function() {
    YaVDR.getHdfValue('system.grub.timeout', function(value) {
      this.getComponent('timeout').setValue(value);
    }, this);
  },
  saveData: function() {
    this.getForm().submit({
      url: 'set_signal?signal=change-timeout',
      timeout: 30, //wait 30 seconds before telling it failed
      waitMsg: getLL("timeout.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("timeout.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("timeout.submit.failure") );
      }
    })
  }
});

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "timeout",
                layout: 'fit',
                items:   function() { return new YaVDR.Grub }});
});