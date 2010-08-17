function getVDRLifeguardForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'lifeguard_radio_group',
            name: 'lifeguard',
            xtype: 'checkboxgroup',
            fieldLabel: getLL("lifeguard.label"),
            columns: 2,
            items: [
                {id: 'aptitude', boxLabel: 'Aptitude', name: 'values', inputValue: 'aptitude'},
                {id: 'ssh', boxLabel: 'SSH', name: 'values', inputValue: 'ssh'},
                {id: 'nfs', boxLabel: 'NFS', name: 'values', inputValue: 'nfs'},
		        {id: 'ftp', boxLabel: 'FTP', name: 'values', inputValue: 'ftp'},
                {id: 'smb', boxLabel: 'SMB', name: 'values', inputValue: 'smb'},		
                {id: 'xbmc', boxLabel: 'XBMC', name: 'values', inputValue: 'xbmc'}
            ]
        },{
            html: '<br/><br/>' + getLL("lifeguard.help")
        }]
    });

    var submit = myform.addButton({
        text: getLL("lifeguard.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-lifeguard',
                timeout: 30, //wait 30 seconds before telling it failed
                waitMsg: getLL("lifeguard.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("lifeguard.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("lifeguard.submit.failure") );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=vdr.lifeguard.enable',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentLifeguard = "";
            try {
                currentLifeguard = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current sound setting.');
            }
            if (currentLifeguard == "aptitude" 
                || currentLifeguard == "ssh" 
                || currentLifeguard == "nfs" 
		        || currentLifeguard == "ftp"
                || currentLifeguard == "smb"
                || currentLifeguard == "xbmc"){
                var rButton = this.getComponent('lifeguard_radio_group');
                if (rButton)
                    rButton.setValue( currentLifeguard );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find lifeguard radiobutton group.');
            }
        }
    });
    
    return myform;
}
