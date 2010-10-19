YaVDR.VdrFrontend = Ext.extend(YaVDR.BaseFormPanel, {
  labelWidth: 200,
  initComponent: function() {
    
    this.items = [
      {
        itemId: 'frontend-group',
        name: 'frontend',
        xtype: 'radiogroup',
        fieldLabel: getLL('frontend.label'),
        anchor: '100%',
        columns: 1,
        items: [
          {
            itemId: 'frontend-xine',
            boxLabel: 'xine@vdr-plugin-xine',
            name: 'value',
            inputValue: 'xine'
            
          },
          {
            itemId: 'frontend-xineliboutput',
            boxLabel: 'vdr-sxfe@vdr-plugin-xineliboutput',
            name: 'value',
            inputValue: 'xineliboutput'
          },
          {
            itemId: 'frontend-xbmc',
            boxLabel: 'XBMC@vdr-plugin-streamdev (experimental)',
            name: 'value',
            inputValue: 'xbmc'
          },
          {
            itemId: 'headless',
            boxLabel: 'headless (yaVDR server)',
            name: 'value',
            inputValue: 'headless'
          }
        ]
      }
    ];
    
    this.buttons = [
      {
        itemId: 'activate',
        text: getLL("frontend.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        scope: this,
        handler: this.activateSelection,
      },
      {
        itemId: 'switch-sreen',
        text: getLL("x11.dualhead.switch_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        scope: this,
        disabled: true && (yavdrwebGlobalInfo.devmode != "1"),
        handler: this.switchScreen,
      }
    ];
    
    YaVDR.VdrFrontend.superclass.initComponent.call(this);
    
    // load store only first time
    this.on('render', this.loadCurrentSelection, this, { single: true });
  },
  loadCurrentSelection: function() {
    Ext.Ajax.request({
      url: 'get_hdf_value?hdfpaths=vdr.frontend&hdfpaths=system.x11.dualhead.enabled&hdfpaths=vdr.plugin.graphtft.enabled',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var data = Ext.util.JSON.decode( xhr.responseText );
        var currentFrontend = "";
        
        // field references
        var frontendGroup = this.getComponent('frontend-group');
        var switchScreenButton = this.getFooterToolbar().getComponent('switch-sreen');
        
        try {
          currentFrontend = data.vdr.frontend;
        } catch (err) {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current frontend.');
          return false; // Abort
        }
        
        if(currentFrontend == "headless" ||
          currentFrontend == "xine" ||
          currentFrontend == "xineliboutput" ||
          currentFrontend == "xbmc") {
          
          frontendGroup.setValue( currentFrontend );
        } else {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not set frontend selection.');
        }
        
        if (data.system.x11.dualhead.enabled == "1" && data.vdr.plugin.graphtft.enabled != "1") {
          switchScreenButton.enable();
        } else {
          switchScreenButton.disable();
        }

      }
    });
    
    
  },
  switchScreen: function() {
    this.getForm().submit({
      url: 'set_signal?signal=change-display',
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
  },
  activateSelection: function() {
    this.getForm().submit({
      url: 'set_signal?signal=change-frontend',
      timeout: 30, //wait 30 seconds before telling it failed
      waitMsg: getLL("frontend.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope:this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("frontend.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("frontend.submit.failure") );
      }
    });
  }
});


/*
function getVDRFrontendForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'frontend_radio_group',
            name: 'frontend',
            xtype: 'radiogroup',
            fieldLabel: getLL("frontend.label"),
            columns: 1,
            items: [
                {id: 'frontend-xine', boxLabel: 'xine@vdr-plugin-xine', name: 'value', inputValue: 'xine'},
                {id: 'frontend-xineliboutput', boxLabel: 'vdr-sxfe@vdr-plugin-xineliboutput', name: 'value', inputValue: 'xineliboutput'},
                {id: 'frontend-xbmc', boxLabel: 'XBMC@vdr-plugin-streamdev (experimental)', name: 'value', inputValue: 'xbmc'},
                {id: 'headless', boxLabel: 'headless (yaVDR server)', name: 'value', inputValue: 'headless'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: getLL("frontend.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-frontend',
                timeout: 30, //wait 30 seconds before telling it failed
                waitMsg: getLL("frontend.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("frontend.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("frontend.submit.failure") );
                }
            })
        }
    });
    
    
    var submit = myform.addButton({
        text: getLL("x11.dualhead.switch_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        id: 'switch_display',
        disabled: true && (yavdrwebGlobalInfo.devmode != "1"),
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-display',
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
        url: 'get_hdf_value?hdfpaths=vdr.frontend&hdfpaths=system.x11.dualhead.enabled&hdfpaths=vdr.plugin.graphtft.enabled',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            var data = Ext.util.JSON.decode( xhr.responseText );
            //alert('Response is "' + xhr.responseText + '"');
            var currentFrontend = "";
            try {
                currentFrontend = data.vdr.frontend;
            } catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current frontend.');
            }
            if (currentFrontend == "headless" || currentFrontend == "xine" || currentFrontend == "xineliboutput" || currentFrontend == "xbmc"){
                var rButton = this.getComponent('frontend_radio_group');
                if (rButton)
                    rButton.setValue( currentFrontend );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find frontend radiobutton group.');
            }
            var rButton = Ext.getCmp('switch_display');
            if (data.system.x11.dualhead.enabled == "1" && data.vdr.plugin.graphtft.enabled != "1") {
                rButton.enable();
            } else {
                rButton.disable();
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
                section: "frontend",
                layout: 'fit',
                items:   function() {return new YaVDR.VdrFrontend()}});
});