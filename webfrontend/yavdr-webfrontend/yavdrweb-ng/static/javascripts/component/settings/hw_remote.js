YaVDR.Component.Settings.HwRemote = Ext.extend(YaVDR.Component, {
  data: {},
  itemId: 'settings-hw-remote',
  title: _('Settings'),
  description: _('Here you can configure your remote hardware. The default and most common choice is EventLircd.'),
//  description: _('<p>In Order to configure your remote control, choose LIRC or one of the both LIRC compatible daemons (Inputlirc or IRServer). If you press "Save" , VDR will be restarted to activate the new settings.<br>If VDR has no key mapping yet it will directly start a learning phase at your output device "On Screen Display". The learning phase ends after a couple of seconds automatically, if no button has been pressed. You can restart the "Learning Phase" by pressing "Save" again..<br>&nbsp;</p><h2>EventLircd</h2><p>Most common choice with autodetect hardware.<br>&nbsp;</p><h2>Lirc</h2><p>In case of serial port conntected devices, please also choose the correct driver and port.<br>&nbsp;</p>'),
  initComponent: function() {

    this.lircForm = new YaVDR.Component.Settings.HwRemote.LIRC({
      base: this
    });

    this.eventlircdForm = new YaVDR.Component.Settings.HwRemote.EventLircd({
      base: this
    });

    this.items = [
      new YaVDR.Component.Item({
        title: _('EventLircd'),
        style: 'margin-bottom: 5px',
        items: this.eventlircdForm
      }),
      new YaVDR.Component.Item({
        title: _('LIRC'),
        items: this.lircForm
      })
    ];
    YaVDR.Component.Settings.HwRemote.superclass.initComponent.call(this);

    this.lircForm.driver.on('enable', function(field) {
      field.setValue(this.data.currentLircReceiver);
    }, this);
    this.lircForm.driver.on('disable', function(field) {
      field.setValue('');
    }, this);
    this.lircForm.serialPort.on('enable', function(field) {
      field.setValue(this.data.currentLircSerialPort);
    }, this);
    this.lircForm.serialPort.on('disable', function(field) {
      field.setValue('');
    }, this);

    this.on('render', this.doLoad, this);
  },

  // Global load
  doLoad: function() {
    Ext.Ajax.request({
      url: '/admin/get_lirchwdb',
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var data = Ext.decode(xhr.responseText);
        this.data.lircReceiverList = data.receiverlist;
        this.data.currentRemoted = data.current_remoted;
        this.data.currentLircReceiver = data.current_receiver;
        this.data.currentLircSerialPort = data.current_serial_port;

        this.lircForm.receiverStore.loadData(this.data.lircReceiverList);
        this.lircForm.active.setValue(this.data.currentRemoted == 'lircd');
        this.eventlircdForm.active.setValue(typeof this.data.currentRemoted == 'undefined' || this.data.currentRemoted == '' || this.data.currentRemoted == 'eventlircd');
      }
    });
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.HwRemote);

YaVDR.Component.Settings.HwRemote.LIRC = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.receiverStore = new Ext.data.ArrayStore({
      fields: [
        "id",
        "description",
        "driver",
        "lirc_driver",
        "hw_default",
        "lircd_conf"
      ],
      sortInfo: {
        field: 'description',
        direction: 'ASC'
      }
    });

    this.driver = new Ext.form.ComboBox({
      itemId: 'driver',
      tpl: '<tpl for="."><div ext:qtip="' +
        _("Driver") +
        ': {driver}<br/' + '>' +
        _('LIRC driver') +
        ': {lirc_driver}<br/' +
        '>' + _('HW-Default') + ': {hw_default}<' + 'br/' +
        '>' + _('Lircd-Conf') + ': {lircd_conf}" class="x-combo-list-item">{description}</div></tpl>',

      hiddenName: 'receiver_id',
      valueField: 'id',
      anchor: '100%',
      displayField:'description',
      typeAhead: true,
      forceSelection: true,
      mode: "local",
      store: this.receiverStore,
      triggerAction: 'all',
      fieldLabel: _('Receiver'),
      selectOnFocus: true,
      disabled: true
    });


    this.serialPort = new Ext.form.RadioGroup({
      itemId: 'serial_port',
      name: 'serial_port',
      columns: 1,
      fieldLabel: _('Serial port'),
      items: [
        {boxLabel: 'none', name: 'serial_port', inputValue: ''},
        {boxLabel: '/dev/ttyS0 (COM1)', name: 'serial_port', inputValue: '/dev/ttyS0'},
        {boxLabel: '/dev/ttyS1 (COM2)', name: 'serial_port', inputValue: '/dev/ttyS1'}
      ],
      disabled: true
    });

    this.active = new Ext.form.Radio({
      name: 'remotetype',
      inputValue: 'lircd',
      fieldLabel: _('Activate LIRC'),
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if (checked) {
            this.base.eventlircdForm.active.setValue(false);
            this.getFooterToolbar().getComponent('save').enable();
            this.serialPort.enable();
            this.driver.enable();
          } else {
            this.getFooterToolbar().getComponent('save').disable();
            this.serialPort.disable();
            this.driver.disable();
          }
        }
      }
    });

    this.items = [
      this.active,
      this.driver,
      this.serialPort
    ];

    YaVDR.Component.Settings.HwRemote.LIRC.superclass.initComponent.call(this);
    this.getFooterToolbar().getComponent('save').disable();
    // own handler -> so disable auto load
    this.un('render', this.doLoad);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_lirchw'
    })
  },
  doLoad: function() {
    this.base.doLoad.call(this.base);
  }
});

YaVDR.Component.Settings.HwRemote.EventLircd = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.active = new Ext.form.Radio({
      name: 'remotetype',
      fieldLabel: _('Activate EventLircd'),
      inputValue: 'eventlircd',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if (checked) {
            this.base.lircForm.active.setValue(false);
            this.getFooterToolbar().getComponent('save').enable();
          } else {
            this.getFooterToolbar().getComponent('save').disable();
          }
        }
      }
    });

    this.items = [
      this.active
    ];

    YaVDR.Component.Settings.HwRemote.EventLircd.superclass.initComponent.call(this);
    this.getFooterToolbar().getComponent('save').disable();
    // own handler -> so disable auto load
    this.un('render', this.doLoad);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_eventlircd'
    })
  },
  doLoad: function() {
    this.base.doLoad.call(this.base);
  }
});
