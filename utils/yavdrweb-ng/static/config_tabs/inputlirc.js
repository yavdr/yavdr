function populateInputlircForm( form, inputlircData ){

    var receiverStore = new Ext.data.ArrayStore({
        storeId : 'inputlirc_receiver_store',
        autoDestroy: true,
        idIndex: 0,
        fields: [
                 "path",
                 "description"
                 ],
        data : inputlircData.receiverlist,
        sortInfo: {
            field: 'description',
            direction: 'ASC'
        }
    });
    
    var cbox = form.getComponent('inputlirc_receiver_combobox');
    cbox.store = receiverStore;
    cbox.hiddenValue = inputlircData.current_receiver;  //initial value, used in POST request
    
    /*
    cbox.on({
        'select' : {
            fn: function ( combo, record, index) {
                adjustSerialSettings(record.data.lirc_driver, record.data.driver );
            },
            scope: this,
            delay: 100
        }
    });
    */

    //if no receiver was chosen before, don't preselect
    if (inputlircData.current_receiver != '' ){
        cbox.value = inputlircData.current_receiver;
    }
    
    if (inputlircData.current_remoted == 'inputlirc') {
        form.enable();
    }
}

function getInputlircForm(){
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
                fieldLabel: 'Inputlirc aktivieren',
                inputValue: 'inputlirc',
                handler: function(checkbox, checked) {
                    if (checked) {
                        var panel = this.findParentByType('remotetabpanel');
                        panel.enableRemoteTab(this);
                    }
                }
            },
            new Ext.form.ComboBox({ 
               id : 'inputlirc_receiver_combobox',
               //name: ... used in POST request
               hiddenName: 'receiver_path', //key, defined in set_lirchw.ecpp, used in POST request
               //set per method hiddenValue: lircData.current_receiver,  //initial value, used in POST request
               valueField: 'path', //value column, used in POST request
               displayField:'description',
               typeAhead: true,
               forceSelection: true,
               mode: "local",
               triggerAction: 'all',
               emptyText: getLL("inputlirc.combobox.emptytext"),
               fieldLabel: getLL("inputlirc.combobox.label"),
               selectOnFocus: true,
               disabled: true
           })
        ]
    });

    var submit = myform.addButton({
        text: getLL("standardform.button.save"),
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_inputlirc',
                tabTip: 'Test',
                waitMsg: getLL("inputlirc.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("inputlirc.submit.success"));
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("inputlirc.submit.failure"));
                }
            })
        },
        disabled: true
    });


    var submit = myform.addButton({
        text: "reload",
        handler: function() {
            Ext.Ajax.request({
                url: 'get_inputlirc',
                timeout: 3000,
                method: 'GET',
                scope: myform,
                success: function(xhr) {
                    //alert('Response is "' + xhr.responseText + '"');
                    var inputlircData = 0;
                    try {
                        inputlircData = Ext.util.JSON.decode( xhr.responseText );
                        //Ext.MessageBox.alert('Success', 'Decode of lircdata OK: ' + lircData.current_receiver);
                    }
                    catch (err) {
                        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("lirc.error.json_decode"));
                    }            
                    populateInputlircForm( this, inputlircData );
                }
            })
        },
        disabled: true
    });

    Ext.Ajax.request({
        url: 'get_inputlirc',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var inputlircData = 0;
            try {
                inputlircData = Ext.util.JSON.decode( xhr.responseText );
                //Ext.MessageBox.alert('Success', 'Decode of lircdata OK: ' + lircData.current_receiver);
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("lirc.error.json_decode"));
            }            
            populateInputlircForm( this, inputlircData );
        }
    });

    return myform;
}
