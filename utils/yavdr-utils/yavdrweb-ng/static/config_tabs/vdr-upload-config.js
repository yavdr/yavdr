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
                {id: 'upload-rb1', boxLabel: '/var/lib/vdr/remote.conf', name: 'file', inputValue: '/var/lib/vdr/remote.conf', checked: true },
                {id: 'upload-rb2', boxLabel: '/etc/vdr/diseqc.conf', name: 'file', inputValue: '/etc/vdr/diseqc.conf'},
                {id: 'upload-rb3', boxLabel: '/var/lib/vdr/channels.conf', name: 'file', inputValue: '/var/lib/vdr/channels.conf'},
                {id: 'upload-rb4', boxLabel: '/etc/lirc/lircd.conf', name: 'file', inputValue: '/etc/lirc/lircd.conf'}
            ]
        },
        new Ext.form.TextArea({
            flex:1,
            id: 'file_upload_textarea',
            maxLength : 1024*1022, // 1MB Upload Limit - 2 KB for Header
            //value: 'test test test',
            style: 'font-family: monospace; white-space: pre; font-size: 12px;',
            //fieldLabel: 'Datei-Inhalt',
            name: 'content'/*, fixme: textarea doesn't have a toolbar!!!
            tbar: [{
                text: 'Refresh',
                icon: 'ext/resources/images/default/grid/refresh.gif',
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
