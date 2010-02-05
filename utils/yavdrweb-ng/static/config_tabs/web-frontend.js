function getWebFrontendForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'web_lang_radio_group',
            name: 'value',
            xtype: 'radiogroup',
            fieldLabel: locale.webfrontend.label,
            columns: 1,
            items: [
                {id: 'lang-en', boxLabel: 'English', name: 'value', inputValue: 'en'},
                {id: 'lang-de', boxLabel: 'German', name: 'value', inputValue: 'de'},
                {id: 'lang-nl', boxLabel: 'Dutch', name: 'value', inputValue: 'nl'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: locale.webfrontend.button_label,
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_hdf_value?key=webfrontend.language',
                waitMsg: locale.webfrontend.submit.waitmsg,
                waitTitle: locale.standardform.messagebox_caption.wait,
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.message, locale.webfrontend.submit.success );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, locale.webfrontend.submit.error );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=webfrontend.language',
        timeout: 3000,
        method: 'GET',
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentFrontend = "";
            try {
                currentFrontend = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, 'Could not recognize current web frontend language.');
            }
            if (currentFrontend == "") currentFrontend == "en";
            if (currentFrontend == "de" || currentFrontend == "en" || currentFrontend == "nl"){
                var rButton = Ext.getCmp('web_lang_radio_group');
                if (rButton)
                    rButton.setValue( currentFrontend );
                else
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, 'Could not find web frontend radiobutton group.');
            }
        }
    });
    
    return myform;
}