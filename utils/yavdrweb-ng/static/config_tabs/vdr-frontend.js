function getVDRFrontendForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'frontend_radio_group',
            name: 'frontend',
            xtype: 'radiogroup',
            fieldLabel: getLL("frontend.label"),
            columns: 1,
            items: [
                {id: 'frontend-xine', boxLabel: 'xine@vdr-plugin-xine', name: 'value', inputValue: 'xine'},
                {id: 'frontend-xineliboutput', boxLabel: 'vdr-sxfe@vdr-plugin-xineliboutput', name: 'value', inputValue: 'xineliboutput'},
                {id: 'frontend-xbmc', boxLabel: 'XBMC@vdr-plugin-streamdev (experimental)', name: 'value', inputValue: 'xbmc'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: getLL("frontend.button_label"),
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-frontend',
                timeout: 30, //wait 30 seconds before telling it failed
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
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentFrontend = "";
            try {
                currentFrontend = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current frontend.');
            }
            if (currentFrontend == "xine" || currentFrontend == "xineliboutput" || currentFrontend == "xbmc"){
                var rButton = this.getComponent('frontend_radio_group');
                if (rButton)
                    rButton.setValue( currentFrontend );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find frontend radiobutton group.');
            }
        }
    });
    
    return myform;
}