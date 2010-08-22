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
            name: 'mode',
            xtype: 'checkboxgroup',
            fieldLabel: getLL("sundtek.label"),
            columns: 2,
            items: [
                {id: 'dvbc', boxLabel: 'DVB-C', name: 'mode', inputValue: 'DVBC'},
                {id: 'dvbt', boxLabel: 'DVB-T', name: 'mode', inputValue: 'DVBT'}
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
                url: '/sundtek/set_dvb',
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


    Ext.Ajax.request({
        url: '/sundtek/get_dvb',
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
            if (currentSundtek == "DVBC" || currentSundtek == "DVBT"){
                var rButton = this.getComponent('sundtek_radio_group');
                if (rButton)
                    rButton.setValue( currentSundtek );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find Sundtek radiobutton group.');
            }
        }
    });
    
    return myform;
}

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "sundtek",
                items:   getVDRSundtekForm});
});