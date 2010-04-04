Ext.form.RemoteFormPanel = Ext.extend(Ext.form.FormPanel, {
    frame: true,
    plain: false,
    border: true,
    bodyStyle:'padding:15px 5px 0',
    labelWidth: 130,
    defaults: {width: 400},
    defaultType: 'textfield',
    buttonAlign: 'left',

    initComponent: function() {
        Ext.form.RemoteFormPanel.superclass.initComponent.call(this);
    },
    
    enable: function() {
        this.items.each(function(e) {
            e.enable();
            if (e.name == 'remotetype') {
                e.setValue(true);
            }
        });
        Ext.each(this.buttons, function(e) {
            e.enable();
        });
    },
    
    disable: function() {
        this.items.each(function(e) {
            if (e.name != 'remotetype') {
                e.disable();
            } else {
                e.setValue(false);
            }
        });
        Ext.each(this.buttons, function(e) {
            e.disable();
        });
    }
});
Ext.reg('remoteform', Ext.form.RemoteFormPanel);

Ext.RemoteTabPanel = Ext.extend(Ext.TabPanel, {
    initComponent: function() {
        Ext.RemoteTabPanel.superclass.initComponent.call(this);
    },
    
    enableRemoteTab: function(radio) {
        var form = radio.findParentByType('remoteform');
        if (form != null) {
            var tab = form.ownerCt;
            this.items.each(function(entry) {
                if (entry.items != null) {
                    entry.items.each(function(e2) {
                        if (e2.getXType() == 'remoteform') {
                            if (entry == tab) {
                                e2.enable();
                            } else {
                                e2.disable();
                            }
                        }
                    });
                }
            });
        }
    }    
});
Ext.reg('remotetabpanel', Ext.RemoteTabPanel);

function getRemoteForm() {
    var panel = new Ext.RemoteTabPanel({
        activeTab: 0,
        plain: false,
        border: false,
        items: [{
            xtype: 'panel',
            title: 'Hilfe',
            frame: true,
            plain: true,
            border: true,
            bodyStyle:'padding:5px',
            html: 'Hilfe!'            
        },{
            title: 'LIRC',
            items: getLircForm()
        },{
            title: 'Inputlirc',
            items: getInputlircForm()
        },{
            title: 'IRServer',
            items: getIRServerForm()
        }]
    });
    return panel;
}