YaVDR.Component.Settings.SystemGeneric = Ext.extend(YaVDR.Component, {
  itemId: 'settings-system-generic',
  title: 'Settings',
  description: 'Hier können allgemeine Systemeinstellungen zum VDR vorgenommen werden.',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: 'Webfrontend Language',
        style: 'margin-bottom: 5px',
        items: [
          new YaVDR.Component.Settings.SystemGeneric.Language
        ]
      }),
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
        fieldLabel: "Choose Timeout in seconds:",
        name: 'value',
        minValue: 0,
        maxValue: 10,
        defaultValue: 0,
        maxText: "The Maximum is 10.",
        minText: "The Minimum is 0."
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


YaVDR.Component.Settings.SystemGeneric.Language = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {


    this.store = new Ext.data.JsonStore({
      fields: [
        { name: 'key' },
        { name: 'title' }
      ],

      data: [
        {
          key: 'zh',
          title: 'Chinese'
        },
        {
          key: 'nl',
          title: 'Dutch'
        },
        {
          key: 'en',
          title: 'English'
        },
        {
          key: 'fr',
          title: 'French'
        },
        {
          key: 'de',
          title: 'German'
        },
        {
          key: 'it',
          title: 'Italian'
        },
        {
          key: 'pt',
          title: 'Portugese'
        }
      ]

    });

    this.languageTpl = new Ext.XTemplate(
      '<tpl for=".">',
      '<div class="selection-wrap selectable" id="language-selection-{key}">',
      '<div class="title">{title}</div>',
      '</div>',
      '</tpl>'
      );

    this.languageSelectionHidden = new Ext.form.Hidden({
      name: 'value',
      value: 'english'
    });

    this.languageSelectiorView = new YaVDR.SelectionList({
      hiddenField: this.languageSelectionHidden,
      fieldLabel: "Language",
      tpl: this.languageTpl,
      store: this.store
    });

    this.items = [
      this.languageSelectionHidden,
      this.languageSelectiorView
    ];

    YaVDR.Component.Settings.SystemGeneric.Language.superclass.initComponent.call(this);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_hdf_value?key=webfrontend.language',
      success: function (form, action) {
        window.location.reload();
      }
    })
  },
  doLoad: function() {
    YaVDR.getHdfValue('webfrontend.language', function(value) {
      this.languageSelectiorView.select("language-selection-" + value);
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
          title: 'Suspend to RAM',
          description: 'Switches the computer into energy saving mode. Only RAM will be supplied with Power. This is the default for yaVDR.'
        },
        {
          key: 's4',
          title: 'Fake Suspend to DISK',
          description: 'Alternative for Suspend to RAM. This can be used as a fallback for some problematic devices'
        },
        {
          key: 's5',
          title: 'Shutdown',
          description: 'This is the classical shutdown.'
        },
        {
          key: 'reboot',
          title: 'reboot PowerOff-kernel',
          description: 'Some Hardware needs the PowerOff kernel in order to be able to shut down. Use this if you have this problem.'
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
      boxLabel: 'Deactivate USB wakeup, for incompatible hardware',
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
            record.data.title = record.data.title + " (not available)";
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
