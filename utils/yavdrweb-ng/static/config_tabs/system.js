function getSystemForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 130,
        defaults: {width: 500},
        defaultType: 'textfield',
        buttonAlign: 'left'
    });

    var submit = myform.addButton({
        text: 'Rechner neu starten (Vorsicht: Keine Sicherhheitsabfrage!)',
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=reboot',
                waitMsg:'Das Signal zum Neu-Start wird abgesetzt.',
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert('Message', 'Der Rechner wird nun neu gestartet.');
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert('Message', 'Fehler beim Absetzen des Signals. Bitte noch einmal versuchen.');
                }
            })
        }
    });

    return myform;
}