function getGRUBTimeoutForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        buttonAlign: 'left',
        items: [
        	new Ext.ux.form.SpinnerField({
        		id: 'timeout',
                fieldLabel: getLL("timeout.label"),
                name: 'value',
                minValue: 0,
                maxValue: 10,
                defaultValue: 0,
                maxText: getLL("timeout.maxText"),
                minText: getLL("timeout.minText")
            })
        ]
    });

    var submit = myform.addButton({
        text: getLL("timeout.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-timeout',
                timeout: 30, //wait 30 seconds before telling it failed
                waitMsg: getLL("timeout.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("timeout.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("timeout.submit.failure") );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=system.grub.timeout',
        timeout: 3000,
        method: 'GET',
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currenttimeout = "";
            try {
                currenttimeout = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current timeout.');
            }
            
            var field = Ext.getCmp('timeout');
            if (field)
                field.setValue( currenttimeout );
            else
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find timeout input field.');

        }
    });
    
    return myform;
}