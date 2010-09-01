function getSoundForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'sound_radio_group',
            name: 'sound',
            xtype: 'radiogroup',
            fieldLabel: getLL("sound.label"),
            columns: 1,
            items: [
                {id: 'analog', boxLabel: 'Analog', name: 'value', inputValue: 'analog'},
                {id: 'spdif', boxLabel: 'Digital (Toslink/SPDIF)', name: 'value', inputValue: 'spdif'},
                {id: 'hdmi', boxLabel: 'HDMI Stereo', name: 'value', inputValue: 'hdmi'},
		{id: 'hdmi+analog', boxLabel: 'HDMI-Analog', name: 'value', inputValue: 'hdmi+analog'},
                {id: 'passthrough', boxLabel: 'HDMI Pass Through', name: 'value', inputValue: 'passthrough'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: getLL("sound.button_label"),
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-sound',
                timeout: 30, //wait 30 seconds before telling it failed
                waitMsg: getLL("sound.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("sound.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("sound.submit.failure") );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=system.sound.type',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentSound = "";
            try {
                currentSound = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current sound setting.');
            }
            if (currentSound == "analog" 
                || currentSound == "spdif" 
                || currentSound == "hdmi" 
		|| currentSound == "hdmi+analog"
                || currentSound == "passthrough"){
                var rButton = this.getComponent('sound_radio_group');
                if (rButton)
                    rButton.setValue( currentSound );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find sound radiobutton group.');
            }
        }
    });
    
    return myform;
}
