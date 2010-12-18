YaVDR.Component.Settings.SystemConfigEditor = Ext.extend(YaVDR.Component, {
  itemId: 'settings-system-config-editor',
  layout: 'border',
  title: _('Settings'),
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Header({
        html: 'Settings',
        region: 'north'
      }),
      {
        region: 'center',
        title: _('Configuration Editor'),
        frame: true,
        layout: 'fit',
        items: new YaVDR.Component.Settings.SystemConfigEditor.Editor
      }

    ];
    YaVDR.Component.Settings.SystemConfigEditor.superclass.initComponent.call(this);
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.SystemConfigEditor);

YaVDR.Component.Settings.SystemConfigEditor.Editor = Ext.extend(Ext.FormPanel, {
  layout: 'fit',
  initComponent: function() {
    this.fileSelectionField = new Ext.form.ComboBox({
      triggerAction: 'all',
      mode: 'local',
      forceSelection: true,
      editable: false,
      width: 250,
      selectOnFocus: true,
      store: new Ext.data.ArrayStore({
        fields: [
          'file'
        ],
        data: [
          ['/var/lib/vdr/remote.conf'],
          ['/etc/vdr/diseqc.conf'],
          ['/var/lib/vdr/channels.conf'],
          ['/etc/lirc/lircd.conf'],
          ['/var/lib/vdr/.xbmc/userdata/Lircmap.xml']
        ]
      }),
      valueField: 'file',
      displayField: 'file',
      listeners: {
        scope: this,
        select: function(cb, record, id) {
          this.loadContent(record.data.file);
        }
      }
    })

    this.tbar = [
      {
        xtype: 'tbtext',
        style: "background: url('/static/images/icons/find.png') no-repeat 3px center; text-indent: 22px;",
        text: _('Choose a file:')
      },
      this.fileSelectionField,
      '-',
      {
        itemId: 'save',
        disabled: true,
        icon: '/static/images/icons/save.png',
        scope: this,
        text: _('Save'),
        handler: this.saveContent
      },
      {
        itemId: 'reload',
        disabled: true,
        icon: '/static/images/icons/refresh.png',
        scope: this,
        text: _('Reload'),
        handler: this.reloadContent
      },
      {
        itemId: 'mask',
        disabled: true,
        icon: '/static/images/icons/selection.png',
        scope: this,
        text: _('Mark content'),
        handler: this.maskContent
      },
      {
        itemId: 'pastebin',
        disabled: true,
        text: _('Send to PasteBin'),
        icon: '/static/images/icons/clipboard-paste-document-text.png',
        scope: this,
        handler: this.sendPasteBin
      }
    ];

    this.items = [
      {
        itemId: 'editor',
        style: 'border: 1px solid #00F',
        hideLabel: true,
        xtype: 'textarea',
        disabled: true,
        name: 'content',
        maxLength : 1024 * 1022, // 1MB Upload Limit - 2 KB for Header
        style: 'font-family: monospace; white-space: pre; font-size: 12px;',
        anchor: '100%'
      }
    ];

    YaVDR.Component.Settings.SystemConfigEditor.Editor.superclass.initComponent.call(this);

    this.loadMask = new Ext.LoadMask(Ext.getBody(), { msg:_("Please wait...") });

    // SubmitHandling from default
    this.on('actioncomplete', YaVDR.Default.Form.prototype.afterComplete, this);
    this.on('beforeaction', YaVDR.Default.Form.prototype.beforeAction, this);
    this.on('actionfailed', YaVDR.Default.Form.prototype.actionFailed, this);

  },
  sendPasteBin: function() {
    YaVDR.PasteBin.paste(this.getComponent('editor').getValue(), this.fileSelectionField.getValue());
  },
  maskContent: function() {
    this.getComponent('editor').selectText(0);
  },
  showLoadMask: function() {
    this.loadMask.show();
  },
  hideLoadMask: function() {
    this.loadMask.hide();
  },
  reloadContent: function() {
    this.showLoadMask();
    YaVDR.getFileContent(this.file, function(content) {
      this.getComponent('editor').setValue(content).enable();
      this.getTopToolbar().getComponent('save').enable();
      this.getTopToolbar().getComponent('reload').enable();
      this.getTopToolbar().getComponent('mask').enable();
      this.getTopToolbar().getComponent('pastebin').enable();
      this.hideLoadMask();
    }, this);
  },
  loadContent: function(file) {
    this.file = file;
    this.reloadContent();
  },
  saveContent: function() {
    this.getForm().submit({
      url: '/admin/set_file_content?file=' + this.file
    })
  }
});
