YaVDR.Component.Settings.HwRemote = Ext.extend(YaVDR.Component, {
  data: {},
  itemId: 'settings-hw-remote',
  title: 'Einstellung',
  description: '<p>Um den Infrarot-Empfänger Ihrer Fernbedienung in Betrieb zu nehmen, wählen Sie LIRC oder einen der beiden zu LIRC kompatiblen Server (Inputlirc oder IRServer) aus. Sie sollten denjenigen Server auswählen, welcher am besten zu der von Ihnen verwendeten Hardware passt. Sobald Sie den Button "Speichern" drücken, wird die Anwendung VDR neu gestartet, um die Änderung zu übernehmen.<br>Wenn Sie dem VDR noch keine Zuordnung der Fernbedienungstasten bekanntgegeben haben, wird Ihnen direkt nach dem Neustart auf der Bildschirmanzeige ("On-Screen-Display") eine Anlernphase für Ihre Fernbedienung angeboten. Die Anlernphase endet, wenn einige Sekunden lang keine Taste auf der Fernbedienung gedrückt wurde. Sie können die Anlernphase erneut starten, indem Sie erneut auf den Button "Speichern" drücken.<br>&nbsp;</p><h2>Lirc</h2><p>Dieses unterstützt die meisten Geräte.<br>Zur Konfiguration ist es nötig zu wissen, welcher Treiber für das eigene Gerät benötigt wird.<br>Wenn es ein serieller Empfänger ist, muss zusätzlich noch die verwendete serielle Schnittstelle ausgewählt werden.<br>&nbsp;</p><h2>InputLirc</h2><p>Einige DVB Karten liefern einen Fernbedienungsempfänger mit. Viele dieser Empfänger, sowie einige USB Empfänger werden als sogenannte INPUT Geräte eingebunden. Hier muss nur der Fernbedienungsempfänger aus der Liste erkannter Geräte ausgewählt werden.<br>&nbsp;</p><h2>Irserver</h2><p>Einige HTPC-Gehäuse (z.B. OrigonAE) haben integrierte Infrarot-Empfänger, welche einen speziellen Server (Irserver) benötigen. Hier muss nur der Server aktiviert und anschließend gespeichert werden.</p>',
  initComponent: function() {

    this.lircForm = new YaVDR.Component.Settings.HwRemote.LIRC({
      base: this
    });

    this.inputlircForm = new YaVDR.Component.Settings.HwRemote.InputLIRC({
      base: this
    });

    this.irserverForm = new YaVDR.Component.Settings.HwRemote.IrServer({
      base: this
    });

    this.items = [
      new YaVDR.Component.Item({
        title: 'LIRC',
        style: 'margin-bottom: 5px',
        items: this.lircForm
      }),
      new YaVDR.Component.Item({
        title: 'Inputlirc',
        style: 'margin-bottom: 5px',
        items: this.inputlircForm
      }),
      new YaVDR.Component.Item({
        title: 'IRServer',
        items: this.irserverForm
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
        this.inputlircForm.active.setValue(this.data.currentRemoted == 'inputlirc');
        this.irserverForm.active.setValue(this.data.currentRemoted == 'irserver');
      }
    });
    this.inputlircForm.reloadReceiver();
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
        "Treiber" +
        ': {driver}<br/' + '>' +
        'LIRC-Treiber' +
        ': {lirc_driver}<br/' +
        '>HW-Default: {hw_default}<' + 'br/' +
        '>Lircd-Conf: {lircd_conf}" class="x-combo-list-item">{description}</div></tpl>',

      hiddenName: 'receiver_id',
      valueField: 'id',
      anchor: '100%',
      displayField:'description',
      typeAhead: true,
      forceSelection: true,
      mode: "local",
      store: this.receiverStore,
      triggerAction: 'all',
      fieldLabel: 'Empfänger',
      selectOnFocus: true,
      disabled: true
    });


    this.serialPort = new Ext.form.RadioGroup({
      itemId: 'serial_port',
      name: 'serial_port',
      columns: 1,
      fieldLabel: 'Serielle Schnittstelle',
      items: [
        {boxLabel: 'keine', name: 'serial_port', inputValue: ''},
        {boxLabel: '/dev/ttyS0', name: 'serial_port', inputValue: '/dev/ttyS0'},
        {boxLabel: '/dev/ttyS1', name: 'serial_port', inputValue: '/dev/ttyS1'}
      ],
      disabled: true
    });

    this.active = new Ext.form.Radio({
      name: 'remotetype',
      inputValue: 'lircd',
      fieldLabel: 'LIRC aktivieren',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if (checked) {
            this.base.irserverForm.active.setValue(false);
            this.base.inputlircForm.active.setValue(false);
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

YaVDR.Component.Settings.HwRemote.InputLIRC = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.active = new Ext.form.Radio({
      name: 'remotetype',
      fieldLabel: 'Inputlirc aktivieren',
      inputValue: 'inputlirc',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if (checked) {
            this.base.irserverForm.active.setValue(false);
            this.base.lircForm.active.setValue(false);
            this.getFooterToolbar().getComponent('reload').enable();
            this.getFooterToolbar().getComponent('save').enable();
            this.receiver.enable();
          } else {
            this.getFooterToolbar().getComponent('reload').disable();
            this.getFooterToolbar().getComponent('save').disable();
            this.receiver.disable();
          }
        }
      }
    });

    this.receiverStore = new Ext.data.ArrayStore({
      fields: [
        "path",
        "description"
      ],
      sortInfo: {
        field: 'description',
        direction: 'ASC'
      }
    });

    this.receiver = new Ext.form.ComboBox({
      anchor: '100%',
      store: this.receiverStore,
      hiddenName: 'receiver_path',
      valueField: 'path',
      displayField:'description',
      typeAhead: true,
      forceSelection: true,
      mode: "local",
      triggerAction: 'all',
      fieldLabel: 'Empfänger',
      selectOnFocus: true,
      disabled: true
    });

    this.items = [
      this.active,
      this.receiver
    ];

    YaVDR.Component.Settings.HwRemote.InputLIRC.superclass.initComponent.call(this);
    this.getFooterToolbar().insert(1, {
      itemId: 'reload',
      icon: '/static/images/icons/refresh.png',
      text: 'Reload',
      scope: this,
      handler: this.reloadReceiver
    });

    this.getFooterToolbar().getComponent('save').disable();
    // own handler -> so disable auto load
    this.un('render', this.doLoad);
  },

  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_inputlirc'
    })
  },
  doLoad: function() {
    this.base.doLoad.call(this.base);
  },
  reloadReceiver: function() {
    Ext.Ajax.request({
      url: '/admin/get_inputlirc',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var data = Ext.decode(xhr.responseText);
        this.base.data.currentInputLircReceiver = data.current_receiver;
        this.base.data.inputLircReceiverList = data.receiverlist;
        this.receiverStore.loadData(this.base.data.inputLircReceiverList);
        this.receiver.setValue(this.base.data.currentInputLircReceiver);

      }
    })
  }
});

YaVDR.Component.Settings.HwRemote.IrServer = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.active = new Ext.form.Radio({
      name: 'remotetype',
      fieldLabel: 'IRServer aktivieren',
      inputValue: 'irserver',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if (checked) {
            this.base.lircForm.active.setValue(false);
            this.base.inputlircForm.active.setValue(false);
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

    YaVDR.Component.Settings.HwRemote.IrServer.superclass.initComponent.call(this);
    this.getFooterToolbar().getComponent('save').disable();
    // own handler -> so disable auto load
    this.un('render', this.doLoad);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_irserver'
    })
  },
  doLoad: function() {
    this.base.doLoad.call(this.base);
  }
});