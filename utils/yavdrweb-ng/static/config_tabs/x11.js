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
                } else {
                    e.disable().setValue(false);
                }
            }
        },{
            id: 'x11_graphtft',
            name: 'x11_graphtft',
            xtype: 'checkbox',
            fieldLabel: getLL("x11.graphtft.label"),
            boxLabel: getLL("x11.graphtft.boxlabel"),
            inputValue: 1,
            disabled: true
        }]
    });

    var submit = myform.addButton({
        text: getLL("x11.button_label"),
        icon: 'ext/resources/images/default/grid/refresh.gif',
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
    
    if (yavdrwebGlobalInfo.devmode == "1") {
        var submit = myform.addButton({
            text: getLL("x11.dualhead.switch_label"),
            icon: 'ext/resources/images/default/grid/refresh.gif',
            //formBind: true,
            //scope: this,
            handler: function() {
                myform.form.submit({
                    url: '',
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
    }
        
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
                if (typeof displayData.system.x11.displays == "undefined") {
                    //this.add();
                    //this.doLayout();
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'no displays found! -> enable form');
                } else {
                    Ext.each(displayData.system.x11.displays, function(item, index, allitems) {
                    
                        this.insert(1, {
                            xtype:'fieldset',
                            checkboxToggle:false,
                            title: 'display ' + index + ': ' + item.name,
                            autoHeight:true,
                            defaults: {width: 210},
                            //defaultType: 'textfield',
                            collapsed: false,
                            items: [{
                                xtype: 'label',
                                html: 'device: ' + item.devicename + '<br />'
                            }, {
                                xtype: 'label',
                                html: 'modeline: ' + item.current_modeline.id + ' ' + item.current_modeline.x + 'x' + item.current_modeline.y + '<br />'
                            },
                            new Ext.form.ComboBox({ 
                               id : 'modeline_' + index,
                               tpl: '<tpl for="."><div ext:qtip="modeline' +
                                         ': {modeline}<br/'+'>' + 
                                         'resolution:{x}x{y}" class="x-combo-list-item">{id}</div></tpl>',
                               //name: ... used in POST request
                               hiddenName: 'modeline['+index+']', //key, defined in set_lirchw.ecpp, used in POST request
                               //set per method hiddenValue: lircData.current_receiver,  //initial value, used in POST request
                               valueField: 'id', //value column, used in POST request
                               displayField: 'id',
                               typeAhead: true,
                               forceSelection: true,
                               mode: "local",
                               triggerAction: 'all',
                               emptyText: 'select resolution',
                               fieldLabel: 'resolution',
                               selectOnFocus: true,
                               store: new Ext.data.JsonStore({
                                    storeId : 'modestore_'+index,
                                    autoDestroy: true,
                                    //root: 'modelines',
                                    idIndex: 0,
                                    fields: [
                                             "id",
                                             "modeline",
                                             "x",
                                             "y"
                                             ],
                                    data : item.modelines
                                }),
                                hiddenValue: item.current_modeline.id
                           })]
                        });
                    }, this);
                    this.doLayout();
                    if (displayData.system.x11.displays.length >= 2) {
                        var current = displayData.system.x11.dualhead.enabled;
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
                    } else {
                        if (rButton) {
                            rButton.disable().setBoxLabel(getLL("x11.dualhead.boxlabelunavailable"));
                        }
                    }
                }
                
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current display settings.' );
            }
        }
    });
    
    return myform;
}