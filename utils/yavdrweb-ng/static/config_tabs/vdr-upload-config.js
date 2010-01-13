function getVDRConfigUploadForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        buttonAlign: 'left',
        defaults: {width: 500},
        items: [{
            id: 'upload_config_radio_group',
            name: 'file',
            xtype: 'radiogroup',
            fieldLabel: 'Hochzuladende Datei',
            columns: 1,
            items: [
                {id: 'upload-rb1', boxLabel: '/var/lib/vdr/remote.conf', name: 'file', inputValue: '/var/lib/vdr/remote.conf', checked: true },
                {id: 'upload-rb2', boxLabel: '/etc/vdr/diseqc.conf', name: 'file', inputValue: '/etc/vdr/diseqc.conf'},
                {id: 'upload-rb3', boxLabel: '/var/lib/vdr/channels.conf', name: 'file', inputValue: '/var/lib/vdr/channels.conf'}
            ]
        },
            new Ext.form.TextArea({
                fieldLabel: 'Datei-Inhalt',
                height: 250,
                width: 800,
                name: 'content'
            })
        ]
    });

    var submit = myform.addButton({
        text: 'Datei hochladen',
        handler: function() {
            myform.form.submit({
                url: 'set_file_content',
                waitMsg:'Konfigurationsdatei wird hochgeladen.',
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert('Message', 'OK.');
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert('Message', 'Fehler.');
                }
            })
        }
    });

    return myform;
}