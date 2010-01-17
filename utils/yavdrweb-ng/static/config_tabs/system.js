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
/*
    var submit_vdr_stop = myform.addButton({
        text: 'VDR stoppen',
        icon: 'ext/resources/images/default/grid/refresh.gif',
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=stop_vdr',
                waitMsg:'Das Signal zum Stoppen des VDR wird abgesetzt.',
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert('Message', 'Der VDR wird nun gestoppt.');
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert('Message', 'Fehler beim Absetzen des Signals. Bitte noch einmal versuchen.');
                }
            })
        }
    });
    */
    var submit_vdr_restart = myform.addButton({
        text: 'VDR-Service neu starten',
        icon: 'ext/resources/images/default/grid/refresh.gif',
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=restart-vdr',
                waitMsg:'Das Signal zum Neustarten des VDR wird abgesetzt.',
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert('Message', 'Der VDR wird nun neu gestartet.');
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert('Message', 'Fehler beim Absetzen des Signals. Bitte noch einmal versuchen.');
                }
            })
        }
    });

    var submit_reboot = myform.addButton({
        text: 'Rechner neu starten (Vorsicht: Keine Sicherheitsabfrage!)',
        icon: 'ext/resources/images/default/grid/refresh.gif',
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