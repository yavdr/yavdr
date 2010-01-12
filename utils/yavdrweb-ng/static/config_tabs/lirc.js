function populateLircForm( lircData ){

    var receiverStore = new Ext.data.ArrayStore({
        storeId : 'lirc_receiver_store',
        autoDestroy: true,
        idIndex: 0,
        fields: [
                 "id",
                 "description",
                 "driver",
                 "lirc_driver",
                 "hw_default",
                 "lircd_conf"
                 ],
        data : lircData.receiverlist,
        sortInfo: {
            field: 'description',
            direction: 'ASC'
        }
    });
    
    var cbox = Ext.getCmp('lirc_receiver_combobox');
    cbox.store = receiverStore;
    cbox.hiddenValue = lircData.current_receiver;  //initial value, used in POST request
    cbox.on({
        'select' : {
            fn: onLircComboBoxChange,
            scope: this,
            delay: 100
        }
    });
    
    //if no serial port was chosen before, don't preselect
    if (lircData.current_serial_port != "")
        Ext.getCmp('serial_port_radio_group').value = lircData.current_serial_port;

    //if no receiver was chosen before, don't preselect
    if (lircData.current_receiver != -1){
        cbox.value = lircData.current_receiver;
        var currentRecord = receiverStore.getById( lircData.current_receiver );
        adjustSerialSettings(currentRecord.get('lirc_driver'), currentRecord.get('driver'));
    }
}

function getLircForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 130,
        defaults: {width: 500},
        defaultType: 'textfield',
        buttonAlign: 'left',
        items:[
           new Ext.form.ComboBox({ 
               id : 'lirc_receiver_combobox',
               tpl: '<tpl for="."><div ext:qtip="Treiber: {driver}<br/'+'>Lirc-Treiber: {lirc_driver}<br/'+
               '>HW-Default: {hw_default}<'+'br/'+'>Lircd-Conf: {lircd_conf}" class="x-combo-list-item">{description}</div></tpl>',
               //name: ... used in POST request
               hiddenName: 'receiver_id', //key, defined in set_lirchw.ecpp, used in POST request
               //set per method hiddenValue: lircData.current_receiver,  //initial value, used in POST request
               valueField: 'id', //value column, used in POST request
               displayField:'description',
               typeAhead: true,
               forceSelection: true,
               mode: "local",
               triggerAction: 'all',
               emptyText:'Bitte Empfänger für Fernbedienung wählen...',
               fieldLabel: 'Empfänger',
               selectOnFocus: true
           }),
           {
                id: 'serial_port_radio_group',
                name: 'serial_port',
                xtype: 'radiogroup',
                fieldLabel: 'Serielle Schnittstelle',
                items: [
                    {id: 'rb1', boxLabel: 'keine',      name: 'serial_port', inputValue: ''},
                    {id: 'rb2', boxLabel: '/dev/ttyS0', name: 'serial_port', inputValue: '/dev/ttyS0'},
                    {id: 'rb3', boxLabel: '/dev/ttyS1', name: 'serial_port', inputValue: '/dev/ttyS1'}
                ]
            }
        ]
    });

    var submit = myform.addButton({
        text: 'Speichern',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_lirchw',
                waitMsg:'Fernbedienungs-Settings werden gespeichert.',
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert('Message', 'Ihre Auswahl wurde erfolgreich gespeichert.');
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert('Message', 'Fehler beim Speichern. Bitte noch einmal versuchen.');
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_lirchwdb',
        timeout: 3000,
        method: 'GET',
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var lircData = 0;
            try {
                lircData = Ext.util.JSON.decode( xhr.responseText );
                //Ext.MessageBox.alert('Success', 'Decode of lircdata OK: ' + lircData.current_receiver);
            }
            catch (err) {
                Ext.MessageBox.alert('ERROR', 'Could not decode lircData');
            }            
            populateLircForm( lircData );
        }
    });
    
    return myform;
}

function onLircComboBoxChange( combo, record, index){
    adjustSerialSettings(record.data.lirc_driver, record.data.driver );
}
    
function adjustSerialSettings(lirc_driver, driver){
    var radioGroup = Ext.getCmp('serial_port_radio_group');
    if (lirc_driver === "lirc_dev lirc_serial" || driver ===  "serial"){
        //radioGroup.setVisible(true); radioGroup.show();
        radioGroup.setDisabled(false);
    }
    else{
        //radioGroup.setVisible(false); radioGroup.hide();
        //Ext.getCmp('serial_port_radio_group').value = 'keine';
        radioGroup.setDisabled(true);
        var box = Ext.getCmp('rb1');
        if (box) box.setValue( true );
    }
}