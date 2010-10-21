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


function getVDRConfigUploadForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: true,
        bodyStyle:'padding:5px 5px 0;',
        labelWidth: 150,
        buttonAlign: 'left',
        layout:'vbox',
        layoutConfig: {
            align : 'stretch'
            //pack  : 'start'
        },
        items: [/*
           new Ext.form.ComboBox({ 
               id : 'upload_config_combobox',
               //name: ... used in POST request
               hiddenName: 'file', //key, used in POST request
               //set per method hiddenValue: lircData.current_receiver,  //initial value, used in POST request
               //valueField: 'id', //value column, used in POST request
               displayField:'description',
               typeAhead: true,
               forceSelection: true,
               mode: "local",
               triggerAction: 'all',
               //emptyText: getLL("lirc.combobox.emptytext"),
               //fieldLabel: getLL("lirc.combobox.label"),
               selectOnFocus: true
           }),*/
           {
            id: 'upload_config_radio_group',
            name: 'file',
            xtype: 'radiogroup',
            //fieldLabel: 'Hochzuladende Datei',
            columns: 1,
            height: 120,
            items: [
                {id: 'upload-rb1', boxLabel: '/var/lib/vdr/remote.conf', name: 'file', inputValue: '/var/lib/vdr/remote.conf'},
                {id: 'upload-rb2', boxLabel: '/etc/vdr/diseqc.conf', name: 'file', inputValue: '/etc/vdr/diseqc.conf'},
                {id: 'upload-rb3', boxLabel: '/var/lib/vdr/channels.conf', name: 'file', inputValue: '/var/lib/vdr/channels.conf'},
                {id: 'upload-rb4', boxLabel: '/etc/lirc/lircd.conf', name: 'file', inputValue: '/etc/lirc/lircd.conf'},
                {id: 'upload-rb5', boxLabel: '/var/lib/vdr/.xbmc/userdata/Lircmap.xml', name: 'file', inputValue: '/var/lib/vdr/.xbmc/userdata/Lircmap.xml'}
            ],
            listeners: {
                change: function( form, newValue, oldValue) {
                    form.disable();
                    var file = newValue.inputValue;
                    Ext.Ajax.request({
                        url: 'get_file_content?file='+file+'&puretext=true',
                        timeout: 3000,
                        method: 'GET',
                        scope: myform,
                        success: function(xhr) {
                            var ta = this.getComponent('file_upload_textarea');
                            if (ta) {
                                ta.setValue(xhr.responseText);
                                ta.setDisabled( false );
                            }
                            form.enable();
                        },
                        failure: function(xhr) {
                            form.enable();
                            var ta = this.getComponent('file_upload_textarea');
                            if (ta) ta.setDisabled( false );
                        }
                    })
                }
            }
        },
        new Ext.form.TextArea({
            flex:1,
            id: 'file_upload_textarea',
            maxLength : 1024*1022, // 1MB Upload Limit - 2 KB for Header
            //value: 'test test test',
            style: 'font-family: monospace; white-space: pre; font-size: 12px;',
            disabled: true,
            //fieldLabel: 'Datei-Inhalt',
            name: 'content'/*, fixme: textarea doesn't have a toolbar!!!
            tbar: [{
                text: 'Refresh',
                icon: '/ext/resources/images/default/grid/refresh.gif',
                tooltip: 'Click this button to refresh file content from hard disk.',
                handler: function(){
                    var thisObj = Ext.getCmp('file_upload_textarea').getUpdater();
                    if(thisObj) thisObj.refresh();
                }
            }]*/
        })]
    });

    var submit = myform.addButton({
        text: getLL("upload.button_label"),
        handler: function() {
            myform.form.submit({
                url: 'set_file_content',
                waitMsg: getLL("upload.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("upload.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("upload.submit.failure") );
                }
            })
        }
    });

    return myform;
}


Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "vdr", expanded: true})
            .addGroupPanelTab({
                section: "upload",
                layout: "fit",
                items:   function() { return new YaVDR.ConfigEditor }});
});