YaVDR.VdrFrontend = Ext.extend(YaVDR.BaseFormPanel, {
  initComponent: function() {
    
    this.store = new Ext.data.JsonStore({
      fields: [
        {
          name: 'key'
        },
        {
          name: 'title'
        },
        {
          name: 'description'
        }
      ],
      data: [
        {
          key: 'xine',
          title: 'xine@vdr-plugin-xine',
          description: 'Diese Variante verwendet den XINE-Player und ist die Standardauswahl für yaVDR'
        },
        {
          key: 'xineliboutput',
          title: 'vdr-sxfe@vdr-plugin-xineliboutput',
          description: 'Eine alternatives Ausgabedevice kann auch Xinelibput verwendet werden.'
        },
        {
          key: 'xbmc',
          title: 'XBMC@vdr-plugin-streamdev (experimental)',
          description: 'Möchten Sie kein VDR-Frontend, sondern XBMC als Fernsehausgabe nutzen so wählen Sie diesen Punkt'
        },
        {
          key: 'headless',
          title: 'headless (yaVDR server)',
          description: 'Diese Variate eignet sich am besten wenn man nur einen Aufnahmeserver benötigt...'
        }
      ]

    });
    
    this.frontendTpl = new Ext.XTemplate(
      '<tpl for=".">',
        '<div class="selection-wrap" id="frontend-selection-{key}">',
          '<div class="title">{title}</div>',
          '<div class="description">{description}</div>',
        '</div>',
      '</tpl>'
    );
    this.frontendTpl.compile();

    this.frontendSelectionHidden = new Ext.form.Hidden({
        itemId: 'frontend-selection',
        name: 'value',
        value: 'bla'
    });
    
    this.frontendSelectiorView = new Ext.DataView({
      cls: 'frame-panel-border',
      style: 'background-color: #FFF;',
      anchor: '100%',
      fieldLabel: getLL('frontend.label'),
      tpl: this.frontendTpl,
      autoHeight:true,
      singleSelect: true,
      overClass:'x-view-over',
      itemSelector: 'div.selection-wrap',
      store: this.store,
      listeners: {
        scope: this,
        selectionchange: function(view, selection) {
          this.frontendSelectionHidden.setValue(selection[0].id.substring(19));
        }
      }
    });
    
    this.items = [
      this.frontendSelectionHidden,
      {
        itemId: 'frontend-selector',
        tbar: [
          {
            itemId: 'activate',
            text: 'Auswahl übernehmen',
            icon: '/static/images/icons/save.png',
            scope: this,
            handler: this.activateSelection,
          },
          {
            itemId: 'switch-screen',
            text: getLL("x11.dualhead.switch_label"),
            icon: '/static/images/icons/switch_screen.png',
            scope: this,
            disabled: true && (yavdrwebGlobalInfo.devmode != "1"),
            handler: this.switchScreen,
          }
        ],
        items: [
          {
            anchor: '100%',
            cls: 'frame-panel-border',
            padding: 5,
            layout: 'form',
            items: [
              this.frontendSelectiorView
            ]
          }
        ]
        
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
        
        var switchScreenButton = this.getComponent('frontend-selector').getTopToolbar().getComponent('switch-screen');
        
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
          
          this.frontendSelectiorView.select("frontend-selection-" + currentFrontend);
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


Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "vdr", expanded: true})
            .addGroupPanelTab({
                section: "frontend",
                layout: 'fit',
                items:   function() {return new YaVDR.VdrFrontend()}});
});