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
                {id: 'frontend-rb1', boxLabel: 'xine', name: 'frontend', inputValue: 'xine'},
                {id: 'frontend-rb2', boxLabel: 'xineliboutput', name: 'frontend', inputValue: 'xineliboutput'}
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

    return myform;
}