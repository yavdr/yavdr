function getX11Form(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [
        {
            id: 'x11_dualhead',
            name: 'x11_dualhead',
            xtype: 'checkbox',
            fieldLabel: getLL("x11.dualhead.label"),
            boxLabel: getLL("x11.dualhead.boxlabel"),
            inputValue: 1,
            scope: myform,
            handler: function(checkbox, checked) {
                var e = Ext.getCmp("x11_graphtft");
                if (checked) {
                    e.enable();
                    for(i = 0; i< 3; i++) {
                        var rButton = Ext.getCmp('primary_'+i);
                        if (rButton) {
                            if (!rButton.getValue()) {
                                rButton = Ext.getCmp('secondary_'+i);
                                if (rButton)
                                    rButton.enable();
                            }
                        }
                    }
                } else {
                    e.disable().setValue(false);
                    for(i = 0; i< 3; i++) {
                        var rButton = Ext.getCmp('secondary_'+i);
                        if (rButton)
                            rButton.disable();
                    }
                }
            }
        },{
            id: 'x11_graphtft',
            name: 'x11_graphtft',
            xtype: 'checkbox',
            fieldLabel: getLL("x11.graphtft.label"),
            boxLabel: getLL("x11.graphtft.boxlabel"),
            inputValue: 1,
            disabled: true,
            listeners:{
                'check' : function( checkbox, checked ) {
                    button = Ext.getCmp("switch_display");
                    if (button) {
                        if (checked || !Ext.getCmp("x11_dualhead").getValue()) {
                            button.disable();
                        } else {
                            button.enable();
                        }
                    }
                }
            }
        },{
            id: 'deinterlacer_hd',
            name: 'deinterlacer_hd',
            xtype: 'combo',
            fieldLabel: getLL("x11.deinterlacer_hd.label"),
            inputValue: 'bob',
            value: 'bob',
            scope: myform,
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: [
                    'item'
                ],
                data: [
                    ['bob'], 
                    ['half temporal'], 
                    ['half temporal_spatial'], 
                    ['temporal'], 
                    ['temporal_spatial']
                ]
            }),
            valueField: 'item',
            displayField: 'item',
            handler: function(checkbox, checked) {
                var e = Ext.getCmp("deinterlacer_hd");

            }
        },{
            id: 'deinterlacer_sd',
            name: 'deinterlacer_sd',
            xtype: 'combo',
            fieldLabel: getLL("x11.deinterlacer_sd.label"),
            inputValue: 'temporal',
            value: 'temporal',
            scope: myform,
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: [
                    'item'
                ],
                data: [
                    ['bob'], 
                    ['half temporal'], 
                    ['half temporal_spatial'], 
                    ['temporal'], 
                    ['temporal_spatial']
                ]
            }),
            valueField: 'item',
            displayField: 'item',
            handler: function(checkbox, checked) {
                var e = Ext.getCmp("deinterlacer_hd");

            }
        }]
    });

    var submit = myform.addButton({
        text: getLL("x11.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_x11',
                timeout: 30, //wait 30 seconds before telling it failed
                waitMsg: getLL("x11.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("x11.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("x11.submit.failure") );
                }
            })
        }
    });
        
    Ext.Ajax.request({
        url: 'get_x11',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            try {
                var displayData = Ext.util.JSON.decode( xhr.responseText );
                var rButton = this.getComponent('x11_dualhead');
                if (typeof displayData.system.x11.displays != "undefined") {
                    Ext.each(displayData.system.x11.displays, function(item, index, allitems) {
                        var hiddenmodeline = new Ext.form.Hidden({
                            name: 'display'+index,
                            value: item.current_modeline.modeline
                        });
                        
                        newitems = [{
                                xtype: 'label',
                                html: getLL('x11.device')+': ' + item.devicename + '<br />'
                            }, {
                                xtype: 'label',
                                html: getLL('x11.modeline')+': ' + item.current_modeline.id + ' ' + item.current_modeline.x + 'x' + item.current_modeline.y + '<br />'
                            },
                            new Ext.form.Hidden({
                                name: 'display'+index,
                                value: item.devicename
                            }),
                            new Ext.form.ComboBox({ 
                               id : 'modeline_' + index,
                               tpl: '<tpl for="."><div ext:qtip="modeline' +
                                         ': &quot;{id}&quot; {modeline}<br/'+'>' + 
                                         getLL('x11.resolution')+':{x}x{y}" class="x-combo-list-item">{id}</div></tpl>',
                               //name: ... used in POST request
                               hiddenName: 'display' + index,  //key, defined in set_lirchw.ecpp, used in POST request
                               //set per method hiddenValue: lircData.current_receiver,  //initial value, used in POST request
                               valueField: 'id', //value column, used in POST request
                               displayField: 'id',
                               typeAhead: true,
                               forceSelection: true,
                               mode: "local",
                               triggerAction: 'all',
                               emptyText: getLL('x11.select_res'),
                               fieldLabel: getLL('x11.resolution'),
                               selectOnFocus: true,
                               store: new Ext.data.JsonStore({
                                    storeId : 'modelinestore_'+index,
                                    autoDestroy: true,
                                    idIndex: 0,
                                    fields: [
                                             "id",
                                             "modeline",
                                             "x",
                                             "y"
                                             ],
                                    data : item.modelines
                                }),
                                value: item.current_modeline.id,
                                hiddenValue: item.current_modeline.id,
                                listeners:{
                                    scope: hiddenmodeline,
                                    'select' : function( combo, record, index){
                                            this.setValue(record.data.modeline);
                                            //this.adjustSerialSettings( record.data.lirc_driver, record.data.driver );
                                    }
                                }
                                //disabled: (index > 0 && !displayData.system.x11.dualhead.enabled)
                           }),
                           hiddenmodeline,
                           new Ext.form.Radio({
                                id: 'primary_' + index,
                                _index: index,
                                _dual: Ext.getCmp('x11_dualhead'),
                                name: 'primary',
                                fieldLabel: getLL('x11.primary'),
                                inputValue: item.devicename,
                                checked: item.primary,
                                listeners: {
                                    check: function( cb,  checked ) {
                                        if (this._dual.getValue()) {
                                            if (checked) {
                                                for(i = 0;i<3;i++) {
                                                    var rButton =  Ext.getCmp('secondary_'+i);
                                                    if (rButton) {
                                                        if (i == this._index)
                                                            rButton.disable().setValue(false);
                                                        else
                                                            rButton.enable();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                           }),{
                               xtype: 'spinnerfield',
                               id: 'nvidia-overscan-slider' + index,
                               //width: 200,
                               name: 'overscan' + index,
                               increment: 1,
                               keyIncrement: 1,
                               minValue: '0',
                               maxValue: 255,
                               fieldLabel: getLL("nvidia.overscan_slider_label"),
                               useTip: true,
                               value: parseInt(item.current_modeline.overscan)
                           }];
                        
                        if ((allitems.length >= 2)) {
                          newitems[newitems.length] = new Ext.form.Radio({
                                id: 'secondary_' + index,
                                _index: index,
                                name: 'secondary',
                                fieldLabel: getLL('x11.secondary'),
                                inputValue: item.devicename,
                                disabled: (displayData.system.x11.dualhead.enabled != '1'),
                                checked: item.secondary,
                                listeners: {
                                    check: function( cb,  checked ) {
                                        //if (checked) alert(cb._index);
                                    }
                                }
                                //checked: (allitems.length != 1)
                           })
                        }
                        this.insert(index+1, {
                            xtype:'fieldset',
                            checkboxToggle:false,
                            title: 'DISPLAY ' + ((typeof item.displaynumber != 'undefined')?':'+item.displaynumber+'.' + item.screen + ' (' + item.name:item.name+' disabled') + ')',
                            autoHeight:true,
                            defaults: {width: 210},
                            //defaultType: 'textfield',
                            collapsed: false,
                            items: newitems                           
                        });

                    }, this);

                    this.doLayout();
                }
                var current;
                
                if (typeof displayData.system.x11.displays == "undefined"
                    || displayData.system.x11.displays.length >= 2
                    || (yavdrwebGlobalInfo.devmode == "1")) {
                    current = displayData.system.x11.dualhead.enabled;
                    if (current == "0" || current == "1") {
                        if (rButton)
                            rButton.setValue( current == "1" );
                        else
                            Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find dualhead checkbox.');
                    }
                    
                    current = displayData.vdr.plugin.graphtft.enabled;
                    if (current == "0" || current == "1") {
                        var rButton = this.getComponent('x11_graphtft');
                        if (rButton)
                            rButton.setValue( current == "1" );
                        else
                            Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find graphTFT checkbox.');
                    }   
                    if (current != "1") {
                        var rButton = Ext.getCmp('switch_display');
                        if (rButton)
                                rButton.enable();
                    }
                } else {
                    if (rButton) {
                        rButton.disable().setBoxLabel(getLL("x11.dualhead.boxlabelunavailable"));
                    }
                }
                
                current = displayData.vdr.deinterlacer.hd.type;
                if (current == "bob" || 
                    current == "half temporal" || 
                    current == "half temporal_spatial" || 
                    current == "temporal" || 
                    current == "temporal_spatial") {
                    var rButton = this.getComponent('deinterlacer_hd');
                    if (rButton)
                        rButton.setValue( current );
                    else
                        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find HD-Interlacer combo.');
                }
                
                current = displayData.vdr.deinterlacer.sd.type;
                if (current == "bob" || 
                    current == "half temporal" || 
                    current == "half temporal_spatial" || 
                    current == "temporal" || 
                    current == "temporal_spatial") {
                    var rButton = this.getComponent('deinterlacer_sd');
                    if (rButton)
                        rButton.setValue( current );
                    else
                        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find SD-Interlacer combo.');
                }
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current display settings.' );
            }
        }
    });
    
    return myform;
}

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "x11",
                items:   getX11Form});
});