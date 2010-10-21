YaVDR.Shutdown = Ext.extend(YaVDR.BaseFormPanel, {
  initComponent: function() {
    
    this.store = new Ext.data.JsonStore({
      fields: [
        { name: 'key' },
        { type: 'boolean', name: 'disabled' },
        { name: 'title' },
        { name: 'description' }
      ],
      data: [
        {
          key: 's3',
          title: getLL("shutdown.items.s3"),
          description: 'Fährt den Rechner in einen Stromspar-Modus wären der RAM weiterhin mit Strom versorgt wird.'
        },
        {
          key: 's4',
          title: getLL("shutdown.items.s4"),
          description: 'Eine alternatives Ausgabedevice und kann verwendet werden falls es Probleme mit xineliboutput gibt'
        },
        {
          key: 's5',
          title: getLL("shutdown.items.s5"),
          description: 'Hierbei wird der Rechner ganz klassich herunter gefahren.'
        },
        {
          key: 'reboot',
          title: getLL("shutdown.items.reboot"),
          description: 'Manche Mainboard benötigen einen Trick damit diese automatisch wieder hochfahren.'
        }
      ]

    });
    
    this.shutdownTpl = new Ext.XTemplate(
      '<tpl for=".">',
         '<tpl if="disabled == true">',
            '<div class="selection-wrap unselectable" id="shutdown-selection-{key}">',
          '</tpl>',
         '<tpl if="disabled == false">',
            '<div class="selection-wrap selectable" id="shutdown-selection-{key}">',
          '</tpl>',
          '<div class="title">{title}</div>',
          '<div class="description">{description}</div>',
        '</div>',
      '</tpl>'
    );
    
    this.shutdownSelectionHidden = new Ext.form.Hidden({
        name: 'value',
        value: 'xineliboutput'
    });
    
    this.shutdownSelectiorView = new YaVDR.SelectionList({
      hiddenField: this.shutdownSelectionHidden,
      fieldLabel: getLL('shutdown.label'),
      tpl: this.shutdownTpl,
      store: this.store
    });
    
    this.disableUsbWakeupField = new Ext.form.Checkbox({
      fieldLabel: 'Disable USB-Wakeup',
      boxLabel: 'USB-Wakeup deaktivieren, wenn Mainboard nicht kompatibel',
      value: 'value2',
      inputValue: '1'
    });
    
    this.items = [
      this.shutdownSelectionHidden,
      {
        anchor: '100%',
        layout: 'form',
        items: [
          this.shutdownSelectiorView,
          this.disableUsbWakeupField
        ]
      }
    ]
    
    this.tbar = [
      {
        scope: this,
        itemId: 'activate',
        text: 'Auswahl übernehmen',
        icon: '/static/images/icons/save.png',
        handler: this.saveSelection
      }
    ];
    
    YaVDR.Shutdown.superclass.initComponent.call(this);
    
    this.on('render', this.disableUnavailables, this, { single: true });
  },
  saveSelection: function() {
    this.getForm().submit({
      url: 'set_signal?signal=change-shutdown',
      timeout: 60, //wait 60 seconds before telling it failed
      waitMsg: getLL("shutdown.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("shutdown.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("shutdown.submit.failure") );
      }
    });
  },
  disableUnavailables: function() {
    Ext.Ajax.request({
      url: 'get_file_content?file=/proc/acpi/sleep&puretext=true',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        // field references
        var allowed = xhr.responseText;
        
        this.store.each(function(record) {
          type = record.data.key
          if(type == 'reboot') { return; }
          
          if(allowed.indexOf(type.toUpperCase()) < 0) {
            record.data.title = getLL("shutdown.items." + record.data.key + "unavailable");
            record.data.disabled = true;
          }
        });
        
        this.shutdownSelectiorView.refresh();
        this.loadSelection.call(this);
      }
    });
  },
  loadSelection: function() {
    Ext.Ajax.request({
      url: 'get_hdf_value?hdfpath=system.shutdown',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var currentShutdown = xhr.responseText;
        if(currentShutdown == "s3" ||
          currentShutdown == "s4" ||
          currentShutdown == "s5" ||
          currentShutdown == "poweroff" ||
          currentShutdown == "reboot") {
            
          this.shutdownSelectiorView.select("shutdown-selection-" + currentShutdown);
        } else {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not set shutdown selection.');
        }
      }
    });
  }
});

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "vdr", expanded: true})
            .addGroupPanelTab({
                section: "shutdown",
                layout: 'fit',
                items:   function() {return new YaVDR.Shutdown();}});
});