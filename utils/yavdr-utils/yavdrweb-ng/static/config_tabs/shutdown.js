YaVDR.Shutdown = Ext.extend(YaVDR.BaseFormPanel, {
  initComponent: function() {
    
    this.items = [
      {
        itemId: 'shutdown-group',
        name: 'frontend',
        xtype: 'radiogroup',
        fieldLabel: getLL('shutdown.label'),
        anchor: '100%',
        columns: 1,
        items: [
          {
            itemId: 's3',
            boxLabel: getLL("shutdown.items.s3"),
            name: 'value',
            inputValue: 's3'
          },
          {
            itemId: 's4',
            boxLabel: getLL("shutdown.items.s4"),
            name: 'value',
            inputValue: 's4'
          },
          {
            itemId: 's5',
            boxLabel: getLL("shutdown.items.s5"),
            name: 'value',
            inputValue: 's5'
          },
          {
            itemId: 'reboot',
            boxLabel: getLL("shutdown.items.reboot"),
            name: 'value',
            inputValue: 'reboot'
          }
        ]
      }
    ]
    
    this.buttons = [
      {
        text: getLL("shutdown.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        scope: this,
        handler: this.saveSelection
      }
    ];
    
    YaVDR.Shutdown.superclass.initComponent.call(this);
    
    this.on('render', this.loadSelection, this, { single: true });
    this.on('render', this.disableUnavailables, this, { single: true });
  },
  saveSelection: function() {
    this.getForm().subbmit({
      url: 'set_signal?signal=change-shutdown',
      timeout: 60, //wait 60 seconds before telling it failed
      waitMsg: getLL("shutdown.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("shutdown.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("shutdown.submit.failure") );
      }
    });
  },
  disableUnavailables: function() {
    Ext.Ajax.request({
      url: 'get_file_content?file=/proc/acpi/sleep&puretext=true',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        // field references
        var shutdownGroup = this.getComponent('shutdown-group');
        var allowed = xhr.responseText;
        
        shutdownGroup.items.each(function(item) {
          // Skip spezial options
          if(item.itemId == 'reboot') { return; }
          if(allowed.indexOf(item.itemId.toUpperCase()) < 0) {
            // todo: add translation instead replace
            item.disable().setBoxLabel(getLL("shutdown.items." + item.itemId + "unavailable"));
          }
        }, this);
      }
    });
  },
  loadSelection: function() {
    Ext.Ajax.request({
      url: 'get_hdf_value?hdfpath=system.shutdown',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        // field references
        var shutdownGroup = this.getComponent('shutdown-group');
        
        var currentShutdown = xhr.responseText;
        if(currentShutdown == "s3" ||
          currentShutdown == "s4" ||
          currentShutdown == "s5" ||
          currentShutdown == "poweroff" ||
          currentShutdown == "reboot") {
          shutdownGroup.setValue(currentShutdown);
        } else {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not set shutdown selection.');
        }
      }
    });
  }
});
/*
function getVDRShutdownForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'shutdown_radio_group',
            name: 'shutdown',
            xtype: 'radiogroup',
            fieldLabel: getLL("shutdown.label"),
            columns: 1,
            items: [
                {id: 'shutdown-s3', boxLabel: getLL("shutdown.items.s3"), name: 'value', inputValue: 's3'},
                {id: 'shutdown-s4', boxLabel: getLL("shutdown.items.s4"), name: 'value', inputValue: 's4'},
                {id: 'shutdown-s5', boxLabel: getLL("shutdown.items.s5"), name: 'value', inputValue: 's5'},
                {id: 'shutdown-reboot', boxLabel: getLL("shutdown.items.reboot"), name: 'value', inputValue: 'reboot'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: getLL("shutdown.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({

            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_file_content?file=/proc/acpi/sleep&puretext=true',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var allowed = xhr.responseText;
            if (allowed.indexOf("S3") < 0) {
                Ext.getCmp('shutdown-s3').disable().setBoxLabel(getLL("shutdown.items.s3unavailable"));
            }
            if (allowed.indexOf("S4") < 0) {
                Ext.getCmp('shutdown-s4').disable().setBoxLabel(getLL("shutdown.items.s4unavailable"));
            }
        }
    });
    
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=system.shutdown',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentshutdown = "";
            try {
                currentshutdown = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current shutdown.');
            }
            if (currentshutdown == "s3" || currentshutdown == "s4" || currentshutdown == "s5" || currentshutdown == "poweroff" || currentshutdown == "reboot"){
                var rButton = this.getComponent('shutdown_radio_group');
                if (rButton)
                    rButton.setValue( currentshutdown );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find shutdown radiobutton group.');
            }
        }
    });
    
    return myform;
}

*/
Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "vdr", expanded: true})
            .addGroupPanelTab({
                section: "shutdown",
                layout: 'fit',
                items:   function() {return new YaVDR.Shutdown();}});
});