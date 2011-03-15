YaVDR.Component.Settings.HwSundtek = Ext.extend(YaVDR.Component, {
  itemId: 'settings_hw_sundtek',
  description: 'You can configure your sundtek DVB hardware here.',
  title: 'Sundtek',
  initComponent: function() {
	this.sundtek = new YaVDR.Component.Settings.HwSundtek.Hardware;
	this.items = [
	  new YaVDR.Component.Item({
		title: 'Sundtek Settings',
		style: 'margin-bottom: 5px',
		items: this.sundtek
	  })
	];
	YaVDR.Component.Settings.HwAudio.superclass.initComponent.call(this);
  },
  doReload: function() {
	this.sundtek.doLoad();  
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.HwSundtek);


YaVDR.Component.Settings.HwSundtek.Hardware = Ext.extend(YaVDR.Default.Form, {
  defaults: {
    xtype: 'fieldset',
    layout: 'form',
    anchor: '100%',
    defaults: {
      anchor: '100%'
    }
  },
  initComponent: function() {

    this.sundtekStore = new Ext.data.JsonStore({
      fields: [
        { name: 'key' },
        { type: 'boolean', name: 'disabled' },
        { name: 'title' },
        { name: 'description' }
      ],
      data: [
        {
          key: 'none',
          title: _('unchanged'),
          description: _('Do not change frontend settings')
        },
        {
          key: 'DVBT',
          title: _('DVB-T')
        },
        {
          key: 'DVBC',
          title: _('DVB-C')
        }
      ]

    });

    this.sundtekTpl = new Ext.XTemplate(
      '<tpl for=".">',
      '<tpl if="disabled == true">',
      '<div class="selection-wrap unselectable" id="mode-selection-{key}">',
      '</tpl>',
      '<tpl if="disabled == false">',
      '<div class="selection-wrap selectable" id="mode-selection-{key}">',
      '</tpl>',
      '<div class="title">{title}</div>',
      '<div class="description">{description}</div>',
      '</div>',
      '</tpl>'
      );

    this.sundtekTpl.compile();

    this.buttons = [
    {
      itemId: 'rescan',
      scope: this,
      text: _('Rescan Sundtek'),
      handler: this.doRescan,
      icon: '/icons/fugue/monitor--plus.png'
    }];
    this.items = [];

      YaVDR.Component.Settings.HwDisplay.Display.superclass.initComponent.call(this);
      //this.getComponent('basic').getComponent('enablenetwork').on('check', this.onCheckNetwork, this);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/sundtek/set_dvb',
      scope: this,
      success: function (form, action) {
        this.doLoad();
      }
    })
  },
//  onCheckNetwork: function(cb, checked) {
//  },
  renderSundtek: function(item, serial, found) {
    var items = [];
    if (found) {
      items.push({
        xtype: 'hidden',
        name: 'serials',
        value: serial,
        disabled: !found
      });      
    }
    
    if (item.info.capabilities.dvbc == "1" && item.info.capabilities.dvbt == "1") {
      
      var selectionHidden = new Ext.form.Hidden({
        name: serial + '|mode',
        disabled: !found
      });
      items.push(selectionHidden);

      var value = item.mode;
      items.push(new YaVDR.SelectionList({
        fieldLabel: _('DVB-Mode'),
        hiddenField: selectionHidden,
        tpl: this.sundtekTpl,
        store: this.sundtekStore,
        disabled: !found,
        listeners: {
          afterrender: function(list) {
            list.select('mode-selection-' + value);
          }
        }
      }));
    }
    
    if (typeof item.info.ip != "undefined") { // remote device
      items.push({
        xtype: 'checkbox',
        fieldLabel: _('mount device'),
        name: serial + '|mount',
        inputValue: 1,
        disabled: !found,
        checked: (item.mount == 1)
      });
      
      items.push({
        disabled: true,
        itemId: serial + '|mounted',
        name: serial + '|mounted',
        xtype: 'checkbox',
        fieldLabel: _('mounted'),
        boxLabel: 'yes',
        inputValue: 1,
        checked: (item.mounted == 1)
      });
    }
    
    if (!found) {
      items.push({
        xtype: 'button',
        text: _('remove this configuration'),
        handler: function(btn) {        
          Ext.Msg.confirm( _('remove this configuration'), _('Do you realy want to remove this configration:'), function(btn, text){
            if (btn == 'yes'){
              Ext.Ajax.request({
                 url: '/sundtek/remove_dvb',
                 params: { serial: serial },
                 success: function() {
                   this.doLoad();
                 },
                 failure: function() {
                   this.doLoad();
                 },
                 scope: this
              });
            }
          }, this);
        },
        scope: this
      });
    }

    this.insert(this.items.length, {
      itemData: item,
      itemId: serial + '|sundtek',
      title: item.info.devicename + (typeof item.info.ip != "undefined"?' @ ' + item.info.ip + ':' + item.info.id:_(' (local)')),
      items: items
    });

  },
  doLoad: function() {
    Ext.Ajax.request({
      url: '/sundtek/get_dvb',
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var sundtekData = Ext.decode(xhr.responseText);
        var basic = this.getComponent('basic');
        this.removeAll(true);
        
        this.insert(1, 
            {
          itemId: 'basic',
          title: _('Basic settings'),
          items: [{
            itemId: 'enablenetwork',
            name: 'enablenetwork',
            xtype: 'checkbox',
            fieldLabel: _('Network-Support'),
            boxLabel: _('allow deviced to be mounted remotely'),
            inputValue: 1,
            checked: sundtekData.sundtek.enablenetwork == "1"
//            listeners: {
//              scope: this,
//              check: this.onCheckNetwork
//            }
          }]
        });
        
        var notfound = new Array();
        Ext.iterate(sundtekData.sundtek.stick, function(key, item) {
          var sundtek = this.getComponent(key+'|sundtek');
          if (sundtek) {
            sundtek.destroy();
          }
          var found = false;
          if (typeof sundtekData.sundtek.found != "undefined") {
            Ext.iterate(sundtekData.sundtek.found, function(index, foundIndex) {
              if (key == foundIndex) {
                found = true;
              }
            });
          }
          if (found) {
            this.renderSundtek.call(this, item, key, true);
          } else {
            notfound[notfound.length] = new Array(item, key);
          }
        }, this);

        for(i = 0; i < notfound.length; i++) {
          this.renderSundtek.call(this, notfound[i][0], notfound[i][1], false);
        }
        this.doLayout();

        // networking setting
        //basic.getComponent('enablenetwork').setValue(sundtekData.sundtek.enablenetwork);
      }
    });
  },
  doRescan: function() {
      Ext.getBody().mask(_('Rescan for sundtek devices.'), 'x-mask-loading');

      Ext.Ajax.request({
        url: '/sundtek/rescan',
        timeout: 3000,
        method: 'GET',
        scope: this,
        success: function(xhr) {
          this.doLoad();
          Ext.getBody().unmask();
        },
        failure:function() {
          Ext.getBody().unmask();
        }
      });
  }
});

YaVDR.Component.Settings.addMenu('hw', 'settings_hw_sundtek', 'Sundtek', '/static/images/icons/sundteklogo.png');