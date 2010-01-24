function getNFSForm(){
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
        items: [{
            id: 'nfs_config',
            name: 'file',
            xtype: 'radiogroup',
            //fieldLabel: 'Hochzuladende Datei',
            columns: 1,
            height: 120,
            items: [
                {id: 'upload-rb1', boxLabel: '/var/lib/vdr/remote.conf', name: 'file', inputValue: '/var/lib/vdr/remote.conf', checked: true },
                {id: 'upload-rb2', boxLabel: '/etc/vdr/diseqc.conf', name: 'file', inputValue: '/etc/vdr/diseqc.conf'},
                {id: 'upload-rb3', boxLabel: '/var/lib/vdr/channels.conf', name: 'file', inputValue: '/var/lib/vdr/channels.conf'}
            ]
        },
        new Ext.form.TextArea({
            flex:1,
            maxLength : 1024*1022, // 1MB Upload Limit - 2 KB for Header
            //value: 'test test test',
            style: 'font-family: monospace; white-space: pre; font-size: 12px;',
            //fieldLabel: 'Datei-Inhalt',
            name: 'content'
        })]
    });

    var submit = myform.addButton({
        text: locale.upload.button_label,
        handler: function() {
            myform.form.submit({
                url: 'set_file_content',
                waitMsg: locale.upload.submit.waitmsg,
                waitTitle: locale.standardform.messagebox_caption.wait,
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.message, locale.upload.submit.success );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, locale.upload.submit.failure );
                }
            })
        }
    });

    return myform;
}