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
        text: locale.frontend.button_label,
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-frontend',
                waitMsg: locale.frontend.submit.waitmsg,
                waitTitle: locale.standardform.messagebox_caption.wait,
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.message, locale.frontend.submit.success );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, locale.frontend.submit.error );
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
                Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, 'Could not recognize current frontend.');
            }
            if (currentFrontend == "xine" || currentFrontend == "xineliboutput" || currentFrontend == "xbmc"){
                var rButton = Ext.getCmp('frontend_radio_group');
                if (rButton)
                    rButton.setValue( currentFrontend );
                else
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, 'Could not find frontend radiobutton group.');
            }
        }
    });
    
    return myform;
}
