YaVDR.Component.Settings.HwDisplay = Ext.extend(YaVDR.Component, {
  itemId: 'settings-hw-display',
  description: _('Here you can configure your display settings.'),
  title: 'Settings',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: _('Display Settings'),
        style: 'margin-bottom: 5px',
        items: new YaVDR.Component.Settings.HwDisplay.Display
      })
    ];
    YaVDR.Component.Settings.HwDisplay.superclass.initComponent.call(this);
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.HwDisplay);

YaVDR.Component.Settings.HwDisplay.Display = Ext.extend(YaVDR.Default.Form, {
  defaults: {
    xtype: 'fieldset',
    layout: 'form',
    anchor: '100%',
    defaults: {
      anchor: '100%'
    }
  },
  initComponent: function() {
    this.buttons = [
	  {
	    itemId: 'rescan',
		scope: this,
		text: _('rescan displays'),
		handler: this.doRescan,
		icon: '/icons/fugue/monitor--plus.png'
	  }
	];
	this.items = [
      {
        itemId: 'basic',
        title: _('Basic Settings'),
        items: [
          {
            disabled: true,
            itemId: 'x11_dualhead',
            name: 'x11_dualhead',
            xtype: 'checkbox',
            fieldLabel: _('Dual-Head Mode'),
            boxLabel: 'enabled',
            inputValue: 1,
            listeners: {
              scope: this,
              check: this.onDualHeadCheck
            }
          },
          {
            itemId: 'x11_graphtft',
            name: 'x11_graphtft',
            xtype: 'checkbox',
            fieldLabel: _('GraphTFT'),
            boxLabel: 'enabled',
            inputValue: 1,
            disabled: true
          }
        ]
      },
      {
        itemId: 'xine',
        title: _('Xine Settings'),
        items: [
          new YaVDR.EasyComboBox({
            itemId: 'deinterlacer_hd',
            name: 'deinterlacer_hd',
            data: [
              ['bob'],
              ['half temporal'],
              ['half temporal_spatial'],
              ['temporal'],
              ['temporal_spatial']
            ],
            fieldLabel: _('Xine HD deinterlacer (Default: bob)'),
            inputValue: 'bob'
          }),
          new YaVDR.EasyComboBox({
            itemId: 'deinterlacer_sd',
            name: 'deinterlacer_sd',
            data: [
              ['bob'],
              ['half temporal'],
              ['half temporal_spatial'],
              ['temporal'],
              ['temporal_spatial']
            ],
            fieldLabel: _('Xine SD deinterlacer (Default: temporal)'),
            inputValue: 'temporal'
          })
        ]
      }]

      YaVDR.Component.Settings.HwDisplay.Display.superclass.initComponent.call(this);
	  this.getComponent('basic').getComponent('x11_dualhead').on('check', this.onCheckDualHead, this);
  },
  doLoad: function() {
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_x11',
      scope: this,
      success: function (form, action) {
        this.doLoad();
      }
    })
  },
  buildFrequencies: function(display, record) {
    var index = display.index;
    var item = display.itemData;

    if (display.getComponent('frequencies')) {
      display.getComponent('frequencies').destroy();
    }

    if (display.getComponent('defaultfreq')) {
      display.getComponent('defaultfreq').destroy();
    }

    var defaultFrequency = new YaVDR.DefaultFrequency({
      index: index,
      name: 'defaultfreq' + index + '_name',
      hiddenName: 'defaultfreq' + index
    });

    var checkboxes = [];
    var count = 0;
    var hasValids = false;
    for (hz in record.data.modes) {
      if (record.data.modes.hasOwnProperty(hz)) {
        ++count;
        hasValids = hasValids || (!record.data.modes[hz].interlace && !record.data.modes[hz].doublescan);
      }
    }

    for (hz in record.data.modes) {
      var mode = record.data.modes[hz];

      var isChecked = false;
      if (display.itemData.current.id == record.data.id && typeof display.itemData.current.selected != "undefined") {
        for (i = 0; i < display.itemData.current.selected.length; i++) {
          if (isChecked = (count == 1 || display.itemData.current.selected[i] == mode.id)) break;
        }
      } else {
        isChecked = ((!mode.interlace && !mode.doublescan) || count == 1 || !hasValids);
      }

      checkboxes.push(new YaVDR.FrequencyCheckbox({
        checked: isChecked,
        hz: hz,
        index: index,
        defaultFrequency: defaultFrequency,
        frequency: record.data.modes[hz]
      }));
    }

    if (typeof display.itemData.current.defaultfreq != 'undefined' &&
      display.itemData.current.id == record.data.id) {
      defaultFrequency.setValue(display.itemData.current.defaultfreq);
    } else {
      // select first
      defaultFrequency.setValue(defaultFrequency.store.getAt(0).data.id);
    }
    display.insert(5, defaultFrequency);

    display.insert(6, {
      name: 'freq' + index,
      xtype: 'checkboxgroup',
      columns: 3,
      fieldLabel: _('Refresh rate'),
      itemId: 'frequencies',
      items: checkboxes
    });


    display.doLayout();
  },
  onModelineSelect: function(combo, record) {
    var display = this.getComponent('display_' + combo.index);

    this.buildFrequencies.call(this, display, record);
  },
  onDualHeadCheck: function(cb, checked) {
    for (index = 0; index < 3; index++) {
      var displayFieldset = this.getComponent('display_' + index);
      if (displayFieldset) {
        if (checked) {
          if (displayFieldset.getComponent('primary').getValue() == '1') {
        	displayFieldset.getComponent('secondary').show().disable().setValue(false);
          } else {
            displayFieldset.getComponent('secondary').show().enable();
          }
        } else {
          displayFieldset.getComponent('secondary').hide().disable().setValue(false);
        }
      }
    }
  },
  onPrimaryCheck: function(cb, checked) {
    // Deaktivere eigenen secondary und aktivere alle anderen
    if (this.getComponent('basic').getComponent('x11_dualhead').getValue()) {
      if (checked) {
        for (index = 0; index < 3; index++) {
          var displayFieldset = this.getComponent('display_' + index);
          if (displayFieldset) {
            if (cb.index != index) {
              displayFieldset.getComponent('secondary').enable();
            } else {
              displayFieldset.getComponent('secondary').disable().setValue(false);
            }
          }
        }
      }
    }
  },
  renderDisplay: function(item, index) {
    var items = []

    items.push({
      hideLabel: true,
      xtype: 'displayfield',
      value: _('device') + ': ' + item.devicename + ', ' + 'modeline' + ': ' + item.current.modeline.x + 'x' + item.current.modeline.y + ' ' + item.current.modeline.name + ' Hz'
    });

    items.push({
      xtype: 'hidden',
      name: 'display' + index,
      value: item.devicename
    });

    items.push({
      xtype: 'radio',
      index: index,
      itemId: 'primary',
      name: 'primary',
      fieldLabel: _('primary'),
      inputValue: item.devicename,
      checked: item.primary,
      listeners: {
        scope: this,
        check: this.onPrimaryCheck
      }
    });

    items.push({
      xtype: 'radio',
      index: index,
      disabled: true,
      itemId: 'secondary',
      name: _('secondary'),
      fieldLabel: 'secondary',
      inputValue: item.devicename,
      checked: item.secondary
    });

    var modelines = new Ext.data.JsonStore({
      idIndex: 0,
      fields: [
        "id",
        "modes"
      ],
      data : item.modelines
    });

    var resolution = null;
    if (item.current.modeline.x>0) {
    	if (item.current.id == "nvidia-auto-select") {
    		resolution = "nvidia-auto-select";
    	} else {
    		resolution = item.current.modeline.x + 'x' + item.current.modeline.y;
    	}
    } else {
    	resolution = 'disabled';
    }
    items.push(new YaVDR.EasyComboBox({
      itemId: 'modeline',
      index: index,
      store: modelines,
      inputValue: 'temporal',
      emptyText: _('select resolution'),
      fieldLabel: _('Resolution'),
      hiddenName: 'modeline' + index,
      value: resolution,
      listeners: {
        scope: this,
        select: this.onModelineSelect,
        render: function(combo) {
          var display = this.getComponent('display_' + combo.index);
          var record = combo.getStore().getById(combo.getValue());
          if (record) {
            this.buildFrequencies.call(this, display, record);
          }
        }
      }
    }));

    items.push({
      xtype: 'spinnerfield',
      itemId: 'nvidia-overscan-slider' + index,
      width: 100,
      anchor: false,
      name: 'overscan' + index,
      increment: 1,
      keyIncrement: 1,
      minValue: '0',
      maxValue: 255,
      fieldLabel: _('Nvidia overscan compensation'),
      useTip: true,
      value: parseInt(item.overscan)
    });

    this.insert(1 + index, {
      index: index,
      itemData: item,
      itemId: 'display_' + index,
      title: _('DISPLAY') + ' ' + ((typeof item.displaynumber != 'undefined') ? ':' + item.displaynumber + '.' + item.screen + ' (' + item.name : ' (' + item.name + ' disabled') + ')',
      items: items
    });

  },
  doLoad: function() {
    Ext.Ajax.request({
      url: '/admin/get_x11',
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var displayData = Ext.decode(xhr.responseText);
        var basic = this.getComponent('basic');
        var xine = this.getComponent('xine');

        if (typeof displayData.system.x11.displays != "undefined") {
          Ext.each(displayData.system.x11.displays, function(item, index) {
            var display = this.getComponent('display_' + index);
            if (display) {
              display.destroy();
            }
            this.renderDisplay.call(this, item, index);
          }, this);
        }

        this.doLayout();

        // Gibt es mehrere Displays
        if (typeof displayData.system.x11.displays == "undefined"
          || displayData.system.x11.displays.length >= 2
          //|| (yavdrwebGlobalInfo.devmode == "1")
          ) {

          // Aktivere CB
          basic.getComponent('x11_dualhead').enable();

          // Wenn ja aktivere CheckBoxen
          var dualhead = displayData.system.x11.dualhead.enabled
          if (dualhead == '0' || dualhead == '1') basic.getComponent('x11_dualhead').setValue(dualhead == '1');

          var graphtft = displayData.vdr.plugin.graphtft.enabled
          if (graphtft == '0' || graphtft == '1') basic.getComponent('x11_graphtft').setValue(graphtft == '1');
        } else {
          // Disable Checkox und Update Texts
          basic.getComponent('x11_dualhead').disable().setBoxLabel('deaktiviert (< 2 Bildschirme gefunden)');
        }

        // Setzte Deinterlacer Settings
        xine.getComponent('deinterlacer_hd').setValue(displayData.vdr.deinterlacer.hd.type);
        xine.getComponent('deinterlacer_sd').setValue(displayData.vdr.deinterlacer.sd.type);
      }
    });
  },
  doRescan: function() {
	  Ext.getBody().mask(_('rescan display. Displays may flicker.'), 'x-mask-loading');

      Ext.Ajax.request({
	    url: '/admin/set_signal?signal=rescan-display',
	    timeout: 3000,
	    method: 'GET',
	    scope: this,
	    success: function(xhr) {
	      Ext.getBody().unmask();
	    },
	    failure:function() {
	      Ext.getBody().unmask();
	    }
	  });
	  
  },
  onCheckDualHead: function(field, check) {
    var basic = this.getComponent('basic');
    if (check) {
      basic.getComponent('x11_graphtft').enable();
    } else {
      basic.getComponent('x11_graphtft').disable().setValue(false);
    }
  }
});


YaVDR.DefaultFrequency = Ext.extend(Ext.form.ComboBox, {
  editable: false,
  forceSelection: true,
  mode: 'local',
  triggerAction: 'all',
  valueField: 'id',
  hiddenName: 'dsdasd',
  displayField: 'label',
  itemId: 'defaultfreq',
  fieldLabel: _('default frequency'),
  initComponent: function() {
    this.store = new Ext.data.JsonStore({
      idProperty: 'id',
      fields: ['id', 'label']
    });
    YaVDR.DefaultFrequency.superclass.initComponent.call(this);
    this.store.on('remove', this.onRecordRemove, this);
    this.on('select', this.test, this);
  },
  onRecordRemove: function(store, record, index) {
    // lösche ich die freq die aus gewählt ist nehme ich den ersten noch verfühgbaren eintrag aus store
    if (record.data.id == this.getValue()) {
      if (this.getStore().getAt(0)) {
        this.setValue(this.getStore().getAt(0).data.id);
      } else {
        this.clearValue();
      }
    }
  }
});

YaVDR.FrequencyCheckbox = Ext.extend(Ext.form.Checkbox, {
  //checked: true,
  initComponent: function() {

    var value = "000" + String(this.frequency.hz);
    this.store = this.defaultFrequency.store;
    value = value.substring(value.length - 3, value.length) + this.frequency.id;

    this.boxLabel = this.hz + ' ' + _('rate');
    this.name = 'freq' + this.index;
    //this.inputValue = value;
    this.inputValue = this.frequency.id;

    this.record = new this.store.recordType({id: this.inputValue, label: this.boxLabel});
    if (this.checked) {
      this.store.add(this.record);
    }

    YaVDR.FrequencyCheckbox.superclass.initComponent.call(this);

    this.on('check', this.updateFrequencyStoreOnCheck, this.store);
  },

  updateFrequencyStoreOnCheck: function(cb, checked) {
    console.log(this.store);
    if (checked) {
      this.add(cb.record);
    } else {
      this.remove(cb.record);
    }
  }
});
