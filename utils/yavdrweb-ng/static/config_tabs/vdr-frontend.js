function getVDRFrontendForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'frontend_radio_group',
            name: 'frontend',
            xtype: 'radiogroup',
            fieldLabel: 'Gew&uuml;nschtes Frontend',
            columns: 1,
            items: [
                {id: 'frontend-xine', boxLabel: 'xine', name: 'frontend', inputValue: 'xine'},
                {id: 'frontend-xineliboutput', boxLabel: 'xineliboutput', name: 'frontend', inputValue: 'xineliboutput'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: 'Frontend-Einstellung aktivieren',
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-frontend',
                waitMsg:'Frontend-Einstellungen werden aktualisiert.',
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
                Ext.MessageBox.alert('ERROR', 'Could not recognize current frontend.');
            }
            if (currentFrontend == "xine" || currentFrontend == "xineliboutput"){
                var rButton = Ext.getCmp('frontend_radio_group');
                if (rButton)
                    rButton.setValue( currentFrontend );
                else
                    Ext.MessageBox.alert('ERROR', 'Could not find frontend radiobutton group.');
            }
        }
    });

    
    return myform;
}