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
            fieldLabel: getLL("shutdown.label"),
            columns: 1,
            items: [
                {id: 'shutdown-s3', boxLabel: getLL("shutdown.items.s3"), name: 'value', inputValue: 's3'},
                {id: 'shutdown-s4', boxLabel: getLL("shutdown.items.s4"), name: 'value', inputValue: 's4'},
                {id: 'shutdown-s5', boxLabel: getLL("shutdown.items.s5"), name: 'value', inputValue: 's5'},
                {id: 'shutdown-reboot', boxLabel: getLL("shutdown.items.reboot"), name: 'value', inputValue: 'reboot'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: getLL("shutdown.button_label"),
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-shutdown',
                timeout: 60, //wait 60 seconds before telling it failed
                waitMsg: getLL("shutdown.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("shutdown.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("shutdown.submit.failure") );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_file_content?file=/proc/acpi/sleep&puretext=true',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var allowed = xhr.responseText;
            if (allowed.indexOf("S3") < 0) {
                Ext.getCmp('shutdown-s3').disable().setBoxLabel(getLL("shutdown.items.s3unavailable"));
            }
            if (allowed.indexOf("S4") < 0) {
                Ext.getCmp('shutdown-s4').disable().setBoxLabel(getLL("shutdown.items.s4unavailable"));
            }
        }
    });
    
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=system.shutdown',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentshutdown = "";
            try {
                currentshutdown = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current shutdown.');
            }
            if (currentshutdown == "s3" || currentshutdown == "s4" || currentshutdown == "s5" || currentshutdown == "poweroff" || currentshutdown == "reboot"){
                var rButton = this.getComponent('shutdown_radio_group');
                if (rButton)
                    rButton.setValue( currentshutdown );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find shutdown radiobutton group.');
            }
        }
    });
    
    return myform;
}