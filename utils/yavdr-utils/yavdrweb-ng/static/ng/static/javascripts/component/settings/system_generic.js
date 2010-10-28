YaVDR.Component.Settings.SystemGeneric = Ext.extend(YaVDR.Component, {
  itemId: 'settings-system-generic',
  title: 'Einstellung',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: 'Shutdown',
        style: 'margin-bottom: 5px',
        items: [
          new YaVDR.Component.Settings.SystemGeneric.Shutdown
        ]
      }),
      new YaVDR.Component.Item({
        title: 'Grub',
        items: [
          new YaVDR.Component.Settings.SystemGeneric.Grub
        ]
      })
    ];


    YaVDR.Component.Settings.SystemGeneric.superclass.initComponent.call(this);
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.SystemGeneric);


YaVDR.Component.Settings.SystemGeneric.Grub = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.items = [
      new Ext.ux.form.SpinnerField({
        itemId: 'timeout',
        fieldLabel: "Wähle Timeout:",
        name: 'value',
        minValue: 0,
        maxValue: 10,
        defaultValue: 0,
        maxText: "Der Maximalwert ist 10",
        minText: "Der Minimalwert ist 0"
      })
    ];


    YaVDR.Component.Settings.SystemGeneric.Grub.superclass.initComponent.call(this);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=change-timeout'
    })
  },
  doLoad: function() {
    YaVDR.getHdfValue('system.grub.timeout', function(value) {
      this.getComponent('timeout').setValue(value);
    }, this);
  }
});


YaVDR.Component.Settings.SystemGeneric.Shutdown = Ext.extend(YaVDR.Default.Form, {
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
          title: 'suspend to RAM',
          description: 'Fährt den Rechner in einen Stromspar-Modus wären der RAM weiterhin mit Strom versorgt wird.'
        },
        {
          key: 's4',
          title: 'suspend to DISK',
          description: 'Eine alternatives Ausgabedevice und kann verwendet werden falls es Probleme mit xineliboutput gibt'
        },
        {
          key: 's5',
          title: 'shutdown',
          description: 'Hierbei wird der Rechner ganz klassich herunter gefahren.'
        },
        {
          key: 'reboot',
          title: 'reboot PowerOff-kernel',
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
      value: 's3'
    });

    this.shutdownSelectiorView = new YaVDR.SelectionList({
      hiddenField: this.shutdownSelectionHidden,
      fieldLabel: 'Gewünschte Methode',
      tpl: this.shutdownTpl,
      store: this.store
    });

    this.disableUsbWakeupField = new Ext.form.Checkbox({
      fieldLabel: 'Disable USB-Wakeup',
      boxLabel: 'USB-Wakeup deaktivieren, wenn Mainboard nicht kompatibel',
      name: 'value2',
      inputValue: '1'
    });

    this.shutdownSelectionHidden.on('change', function(field, value) {
      if (value == 's3' || value == 's4') {
        this.enable();
      } else {
        this.disable().setValue(false);
      }
    }, this.disableUsbWakeupField);

    this.items = [
      this.shutdownSelectionHidden,
      this.shutdownSelectiorView,
      this.disableUsbWakeupField
    ];


    YaVDR.Component.Settings.SystemGeneric.Shutdown.superclass.initComponent.call(this);
    this.on('render', this.disableUnavailables, this, { single: true });
  },
  disableUnavailables: function() {
    Ext.Ajax.request({
      url: '/admin/get_file_content?file=/proc/acpi/sleep&puretext=true',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        // field references
        var allowed = xhr.responseText;


        this.store.each(function(record) {
          type = record.data.key
          if (type == 'reboot' || type == 'poweroff') {
            return;
          }

          if (allowed.indexOf(type.toUpperCase()) < 0) {
            record.data.title = record.data.title + " (nicht verfühgbar)";
            record.data.disabled = true;
          }
        });

        this.shutdownSelectiorView.refresh();
        this.doLoad.call(this);
      }
    });
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=change-shutdown'
    })
  },
  doLoad: function() {
    YaVDR.getHdfValue('system.shutdown', function(value) {
      this.shutdownSelectiorView.select("shutdown-selection-" + value);
    }, this);
    YaVDR.getHdfValue('system.disable_usb_wakeup', function(value) {
      if (value == "1") {
        this.disableUsbWakeupField.setValue(1);
      }
    }, this);
  }
});