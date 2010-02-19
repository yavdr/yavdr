function getVDRShutdownForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'shutdown_radio_group',
            name: 'shutdown',
            xtype: 'radiogroup',
            fieldLabel: locale.shutdown.label,
            columns: 1,
            items: [
                {id: 'shutdown-s3', boxLabel: 's3', name: 'value', inputValue: 's3'},
                {id: 'shutdown-s5', boxLabel: 's5', name: 'value', inputValue: 's5'},
                {id: 'shutdown-poweroff', boxLabel: 'poweroff', name: 'value', inputValue: 'poweroff'},
                {id: 'shutdown-reboot', boxLabel: 'reboot poweroff kernel', name: 'value', inputValue: 'reboot'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: locale.shutdown.button_label,
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-shutdown',
                timeout: 30, //wait 30 seconds before telling it failed
                waitMsg: locale.shutdown.submit.waitmsg,
                waitTitle: locale.standardform.messagebox_caption.wait,
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.message, locale.shutdown.submit.success );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, locale.shutdown.submit.error );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=vdr.shutdown',
        timeout: 3000,
        method: 'GET',
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentshutdown = "";
            try {
                currentshutdown = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, 'Could not recognize current shutdown.');
            }
            if (currentshutdown == "s3" || currentshutdown == "s5" || currentshutdown == "poweroff" || currentshutdown == "reboot"){
                var rButton = Ext.getCmp('shutdown_radio_group');
                if (rButton)
                    rButton.setValue( currentshutdown );
                else
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, 'Could not find shutdown radiobutton group.');
            }
        }
    });
    
    return myform;
}