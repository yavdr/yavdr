function getNvidiaForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [
            new Ext.Slider({
                fieldLabel: 'Nvidia Overscan compensation',
                width: 200,
                value: 0,
                increment: 1,
                minValue: 0,
                maxValue: 255
            })
                ]
    });

    var submit = myform.addButton({
        text: getLL("frontend.button_label"),
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-frontend',
                waitMsg: getLL("frontend.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("frontend.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("frontend.submit.failure") );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=vdr.frontend',
        timeout: 3000,
        method: 'GET',
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentFrontend = "";
            try {
                currentFrontend = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current frontend.');
            }
            if (currentFrontend == "xine" || currentFrontend == "xineliboutput"){
                var rButton = Ext.getCmp('frontend_radio_group');
                if (rButton)
                    rButton.setValue( currentFrontend );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find frontend radiobutton group.');
            }
        }
    });
    
    return myform;
}