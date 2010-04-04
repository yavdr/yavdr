function populateIRServerForm( form, irserverData ){

    if (irserverData.current_remote == 'irserver') {
        form.enable();
    }
}

function getIRServerForm(){
    var myform = new Ext.form.RemoteFormPanel({
        frame: true,
        plain: false,
        border: true,
        bodyStyle:'padding:15px 5px 0',
        labelWidth: 130,
        defaults: {width: 400},
        defaultType: 'textfield',
        buttonAlign: 'left',
        //width:300, height: 300,
        layout: 'form',

        items:[{
                xtype: 'radio',
                name: 'remotetype',
                fieldLabel: 'IRServer aktivieren',
                inputValue: 'irserver',
                handler: function(checkbox, checked) {
                    if (checked) {
                        var panel = this.findParentByType('remotetabpanel');
                        panel.enableRemoteTab(this);
                    }
                }
        }]
    });

    var submit = myform.addButton({
        text: getLL("standardform.button.save"),
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_irserver',
                tabTip: 'Test',
                waitMsg: getLL("irserver.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("irserver.submit.success"));
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("irserver.submit.failure"));
                }
            })
        },
        disabled: true
    });

    Ext.Ajax.request({
        url: 'get_irserver',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var inputlircData = 0;
            try {
                irserverData = Ext.util.JSON.decode( xhr.responseText );
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("irserver.error.json_decode"));
            }            
            populateIRServerForm( this, irserverData );
        }
    });

    return [ 
        myform,
        new Ext.Panel({
            width: "100%",
            layout: 'fit',
            frame: false,
            border: false,
            bodyStyle:'padding:5px 5px 0',
            html: '<p style="font-size: 12px;">' + getLL("irserver.help") + "</p>"
        })
    ];
}
