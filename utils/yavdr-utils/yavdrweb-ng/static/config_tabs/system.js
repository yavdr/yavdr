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
        icon: '/ext/resources/images/default/grid/refresh.gif',
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
        text: getLL("system.vdr_restart.label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=restart-vdr',
                waitMsg: getLL("system.vdr_restart.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("system.vdr_restart.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("system.vdr_restart.submit.failure") );
                }
            })
        }
    });

    var submit_kill_xbmc = myform.addButton({
        text: getLL("system.kill_xbmc.label"),
        //icon: '/ext/resources/images/default/grid/refresh.gif',
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=kill-xbmc',
                waitMsg: getLL("system.kill_xbmc.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("system.kill_xbmc.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("system.kill_xbmc.submit.failure") );
                }
            })
        }
    });

    var submit_reboot = myform.addButton({
        text: getLL("system.system_restart.label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=reboot',
                waitMsg: getLL("system.system_restart.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("system.system_restart.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("system.system_restart.submit.failure") );
                }
            })
        }
    });
    return myform;
}

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "system",
                items:   getSystemForm});
});