function getVDRSundtekForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'sundtek_radio_group',
            name: 'sundtek',
            xtype: 'checkboxgroup',
            fieldLabel: getLL("sundtek.label"),
            columns: 2,
            items: [
                {id: 'dvbc', boxLabel: 'DVB-C', name: 'values', inputValue: 'dvbc'},
                {id: 'dvbt', boxLabel: 'DVB-T', name: 'values', inputValue: 'dvbt'}
            ]
        },{
            html: '<br/><br/>' + getLL("sundtek.help")
        }]
    });

    var submit = myform.addButton({
        text: getLL("sundtek.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_dvb',
                timeout: 30, //wait 30 seconds before telling it failed
                waitMsg: getLL("sundtek.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("sundtek.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("sundtek.submit.failure") );
                }
            })
        }
    });

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
    
    Ext.Ajax.request({
        url: 'get_dvb',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentSundtek = "";
            try {
                currentSundtek = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current sound setting.');
            }
            if (currentSundtek == "dvbc" || currentSundtek == "dvbt"){
                var rButton = this.getComponent('Sundtek_radio_group');
                if (rButton)
                    rButton.setValue( currentSundtek );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find Sundtek radiobutton group.');
            }
        }
    });
    
    return myform;
}
