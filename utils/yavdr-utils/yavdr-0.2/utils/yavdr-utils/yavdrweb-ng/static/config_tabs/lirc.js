/*
 * getLircForm
 */
function getLircForm(){
    var lircFormInstance = new lircForm();
    lircFormInstance.loadJSONData();
    return lircFormInstance.getExtjsForm();
}

/*
 * lircForm (constructor)
 */
function lircForm(){
    
    this.combobox = new Ext.form.ComboBox({ 
        //id : 'lirc_receiver_combobox',
        tpl: '<tpl for="."><div ext:qtip="' + 
                getLL("lirc.combobox.tooltip.driver") + 
                ': {driver}<br/'+'>' + 
                getLL("lirc.combobox.tooltip.lirc_driver") + 
                ': {lirc_driver}<br/'+
                '>HW-Default: {hw_default}<'+'br/'+
                '>Lircd-Conf: {lircd_conf}" class="x-combo-list-item">{description}</div></tpl>',
        //name: ... used in POST request
        hiddenName: 'receiver_id', //key, defined in set_lirchw.ecpp, used in POST request
        //set per method hiddenValue: lircData.current_receiver,  //initial value, used in POST request
        valueField: 'id', //value column, used in POST request
        displayField:'description',
        typeAhead: true,
        forceSelection: true,
        mode: "local",
        triggerAction: 'all',
        emptyText: getLL("lirc.combobox.emptytext"),
        fieldLabel: getLL("lirc.combobox.label"),
        selectOnFocus: true,
        disabled: true
    });
    
    this.serialPortGroup = new Ext.form.RadioGroup({
        //id: 'serial_port_radio_group',
        name: 'serial_port',
        columns: 1,
        fieldLabel: getLL("lirc.serial_radiogroup.label"),
        items: [
            {id: 'rb1', boxLabel: getLL("lirc.serial_radiogroup.boxlabel_none"), name: 'serial_port', inputValue: ''},
            {id: 'rb2', boxLabel: '/dev/ttyS0', name: 'serial_port', inputValue: '/dev/ttyS0'},
            {id: 'rb3', boxLabel: '/dev/ttyS1', name: 'serial_port', inputValue: '/dev/ttyS1'}
        ],
        disabled: true
    });
    
    this.myform = new Ext.form.RemoteFormPanel({
        items:[
            {
                xtype: 'radio',
                name: 'remotetype',
                inputValue: 'lircd',
                fieldLabel: 'LIRC aktivieren',
                handler: function(checkbox, checked) {
                    if (checked) {
                        var panel = this.findParentByType('remotetabpanel');
                        panel.enableRemoteTab(this);
                    }
                }
            },
            this.combobox,
            this.serialPortGroup
        ]
    });

    var submit = this.myform.addButton({
        text: getLL("standardform.button.save"),
        //formBind: true,
        scope: this,
        handler: function() {
            this.myform.form.submit({
                url: 'set_lirchw',
                tabTip: 'Test',
                waitMsg: getLL("lirc.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("lirc.submit.success"));
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("lirc.submit.failure"));
                }
            })
        },
        disabled: true
    });
}

/*
 * loadJSONData
 */
lircForm.prototype.loadJSONData = function (){
    Ext.Ajax.request({
        url: 'get_lirchwdb',
        timeout: 3000,
        method: 'GET',
        scope: this,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var lircData = 0;
            try {
                lircData = Ext.util.JSON.decode( xhr.responseText );
                //Ext.MessageBox.alert('Success', 'Decode of lircdata OK: ' + lircData.current_receiver);
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("lirc.error.json_decode"));
            }            
            this.lircData = lircData;
            this.populateFields();
        }
    });
}

/*
 * populateFields
 */
lircForm.prototype.populateFields = function (){

    this.combobox.store = new Ext.data.ArrayStore({
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
        data : this.lircData.receiverlist,
        sortInfo: {
            field: 'description',
            direction: 'ASC'
        }
    });
    this.combobox.hiddenValue = this.lircData.current_receiver;  //initial value, used in POST request
    this.combobox.on({
        'select' : {
            fn: this.onComboBoxChange,
            scope: this,
            delay: 100
        }
    });

    //if no serial port was chosen before, don't preselect
    if (this.lircData.current_serial_port != "")
        this.serialPortGroup.setValue(this.lircData.current_serial_port);

    //if no receiver was chosen before, don't preselect
    if (this.lircData.current_receiver != -1){
        this.combobox.setValue(this.lircData.current_receiver );
        var currentRecord = this.combobox.store.getById( this.lircData.current_receiver );
        this.adjustSerialSettings( currentRecord.get('lirc_driver'), currentRecord.get('driver'));
    }
    
    if (this.lircData.current_remoted == 'lircd') {
        this.myform.enable();
    }
}

/*
 * getExtjsForm
 */
lircForm.prototype.getExtjsForm = function(){
    return this.myform;
}

/*
 * onComboBoxChange
 */
lircForm.prototype.onComboBoxChange = function( combo, record, index){
    this.adjustSerialSettings( record.data.lirc_driver, record.data.driver );
}

/*
 * adjustSerialSettings
 */
lircForm.prototype.adjustSerialSettings = function(lirc_driver, driver){
    if (lirc_driver === "lirc_dev lirc_serial" || driver ===  "serial"){
        this.serialPortGroup.setDisabled(false);
    }
    else{
        this.serialPortGroup.setValue( '' );
        this.serialPortGroup.setDisabled(true);
    }
}