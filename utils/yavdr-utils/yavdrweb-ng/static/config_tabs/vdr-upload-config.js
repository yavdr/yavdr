YaVDR.ConfigEditor = Ext.extend(YaVDR.BaseFormPanel, {
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
            'file',
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
        text: 'Wähle eine Datei: '
      },
      this.fileSelectionField,
      '-',
      {
        itemId: 'save',
        disabled: true,
        icon: '/static/images/icons/save.png',
        scope: this,
        text: 'Speichern',
        handler: this.saveContent
      },
      {
        itemId: 'reload',
        disabled: true,
        icon: '/static/images/icons/refresh.png',
        scope: this,
        text: 'Neuladen',
        handler: this.reloadContent
      }
    ];
    
    this.items = [
      {
        itemId: 'editor',
        hideLabel: true,
        xtype: 'textarea',
        disabled: true,
        name: 'content',
        maxLength : 1024*1022, // 1MB Upload Limit - 2 KB for Header
        style: 'font-family: monospace; white-space: pre; font-size: 12px;',
        anchor: '100%'
      }
    ]
    YaVDR.ConfigEditor.superclass.initComponent.call(this);
    this.loadMask = new Ext.LoadMask(Ext.getBody(), { msg:"Please wait..." });
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
      this.hideLoadMask();
    }, this);
  },
  loadContent: function(file) {
    this.file = file;
    this.reloadContent();
  },
  saveContent: function() {
    this.getForm().submit({
      url: 'set_file_content?file=' + this.file,
      waitMsg: getLL("upload.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("upload.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("upload.submit.failure") );
      }
    })
  }
});

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "vdr", expanded: true})
            .addGroupPanelTab({
                section: "upload",
                layout: "fit",
                items:   function() { return new YaVDR.ConfigEditor }});
});