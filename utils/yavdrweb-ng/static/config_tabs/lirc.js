function getLircForm( lircData ){

    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 130,
        defaults: {width: 500},
        defaultType: 'textfield',
        items: [
                new Ext.form.ComboBox({ 
                    id : 'lirc_receiver_combobox',
                    tpl: '<tpl for="."><div ext:qtip="Treiber: {driver}<br/'+'>Lirc-Treiber: {lirc_driver}<br/'+
                    '>HW-Default: {hw_default}<'+'br/'+'>Lircd-Conf: {lircd_conf}" class="x-combo-list-item">{description}</div></tpl>',
                    store: new Ext.data.ArrayStore({
                        id : 'lirc_receiver_store',
                        fields: [
                                 "id",
                                 "description",
                                 "driver",
                                 "lirc_driver",
                                 "hw_default",
                                 "lircd_conf"
                                 ],
                                 data : lircData.receiverlist
                    }),
                    //name: ... used in POST request
                    hiddenName: 'receiver_id', //key, defined in set_lirchw.ecpp, used in POST request
                    hiddenValue: lircData.current_receiver,  //initial value, used in POST request
                    valueField: 'id', //value column, used in POST request
                    displayField:'description',
                    typeAhead: true,
                    forceSelection: true,
                    mode: "local",
                    triggerAction: 'all',
                    emptyText:'Bitte Empfänger für Fernbedienung wählen...',
                    fieldLabel: 'Empfänger',
                    selectOnFocus:true
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

    //if no receiver was chosen before, don't preselect
    if (lircData.current_receiver != -1)
        Ext.getCmp('lirc_receiver_combobox').value = lircData.current_receiver;

    //if no serial port was chosen before, don't preselect
    if (lircData.current_serial_port != "")
        Ext.getCmp('serial_port_radio_group').value = lircData.current_serial_port;

    function onComboBoxChange( combo, record, index){
        var radioGroup = Ext.getCmp('serial_port_radio_group');
        if (record.data.lirc_driver == "lirc_dev lirc_serial" || record.data.driver ==  "serial"){
            //radioGroup.setVisible(true); radioGroup.show();
            radioGroup.setDisabled(false);
        }
        else{
            //radioGroup.setVisible(false); radioGroup.hide();
            Ext.getCmp('rb1').setValue( true);
            radioGroup.setDisabled(true);
        }
    }

    Ext.getCmp('lirc_receiver_combobox').on({
        'select' : {
        fn: onComboBoxChange,
        scope: this,
        delay: 100
    }
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

    return myform;
}